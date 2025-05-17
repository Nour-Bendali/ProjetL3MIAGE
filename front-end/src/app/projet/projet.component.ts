// src/app/projet/projet.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { MissionFormComponent } from '../mission-form/mission-form.component';
import { MissionListComponent } from '../mission-list/mission-list.component';

import {
  ProjetService,
  PersonnelWithCompetences
} from '../services/projet.service';

interface Mission {
  IdMission: number;
  NomMission: string;
  Description?: string;
  IdProjet: number;
  DateCreation: string;
  membres_assignes?: string[];
  competences_requises?: string[];
}

interface Projet {
  IdProjet: number;
  NomProjet: string;
  Description: string;
  CreateurId: number;
  DateCreation: string;
  missions?: Mission[];
}

@Component({
  selector: 'app-projet',
  standalone: true,
  imports: [CommonModule, RouterModule, MissionFormComponent, MissionListComponent],
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {
  @ViewChild(MissionListComponent) missionList!: MissionListComponent;

  projet: Projet | null = null;
  membres: PersonnelWithCompetences[] = [];
  projectId!: number;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private projetService: ProjetService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProjet();
  }

  retour(): void {
    this.location.back();
  }

  private loadProjet(): void {
    if (!this.projectId) {
      this.errorMessage = 'ID de projet invalide.';
      return;
    }

    this.http
      .get<Projet>(`http://localhost:3000/api/projets/${this.projectId}`)
      .subscribe({
        next: project => {
          this.projet = project;
          console.log('✅ Projet chargé', this.projet);
          // charger les membres dès que le projet est chargé
          this.loadMembres();
          // rafraîchir les missions via le composant enfant
          this.missionList?.refreshMissions();
        },
        error: err => {
          console.error('❌ Erreur lors du chargement du projet', err);
          this.errorMessage = 'Impossible de charger le projet. Veuillez réessayer plus tard.';
        }
      });
  }

  /** Charge la liste des membres avec leurs compétences */
  private loadMembres(): void {
    this.projetService.getProjectMembers(this.projectId).subscribe({
      next: data => {
        this.membres = data;
      },
      error: err => {
        console.error('❌ Erreur lors du chargement des membres', err);
      }
    });
  }

  // Méthode appelée quand les missions sont mises à jour par le composant enfant
  onMissionsUpdated(missions: Mission[]): void {
    if (this.projet) {
      this.projet.missions = missions;
    }
  }

  // Méthode pour rafraîchir les missions
  refreshMissions(): void {
    this.missionList?.loadMissions();
  }
}
