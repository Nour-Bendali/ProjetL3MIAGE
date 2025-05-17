// src/app/projet/projet.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { MissionFormComponent } from '../mission-form/mission-form.component';
import { MissionListComponent } from '../mission-list/mission-list.component';
import { Mission } from '../services/mission.service';

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
  projectId!: number;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProjet();
  }

  retour(): void {
    this.location.back();
  }

  loadProjet(): void {
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
          // Rafraîchir les missions via le composant enfant
          if (this.missionList) {
            this.missionList.refreshMissions();
          }
        },
        error: err => {
          console.error('❌ Erreur lors du chargement du projet', err);
          this.errorMessage = 'Impossible de charger le projet. Veuillez réessayer plus tard.';
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
    if (this.missionList) {
      this.missionList.loadMissions();
    }
  }

}
