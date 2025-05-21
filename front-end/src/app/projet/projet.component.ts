// src/app/projet/projet.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProjetService } from '../services/projet.service';
import { MissionListComponent } from '../mission-list/mission-list.component';
import { MissionFormComponent } from '../mission-form/mission-form.component';

@Component({
  selector: 'app-projet',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MissionListComponent,
    MissionFormComponent
  ],
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {
  projectId!: number;
  projet: any;
  membres: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetService: ProjetService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = '❌ Aucun ID projet fourni.';
      return;
    }

    const parsedId = parseInt(idParam, 10);

    if (isNaN(parsedId) || parsedId <= 0) {
      this.errorMessage = '❌ ID projet invalide.';
      return;
    }

    this.projectId = parsedId;
    this.loadProjet();
    this.loadMembres();
  }

  loadProjet(): void {
    this.projetService.getProjetById(this.projectId).subscribe({
      next: data => {
        this.projet = data;
        this.errorMessage = null; // ✅ tout va bien
      },
      error: err => {
        console.error('Erreur lors du chargement du projet :', err);
  
        if (err.status === 403) {
          this.errorMessage = '⛔ Vous n’avez pas accès à ce projet.Vous n\'etes ni membre ni createur de ce projet';
        } else if (err.status === 404) {
          this.errorMessage = '📁 Projet introuvable.';
        } else {
          this.errorMessage = '❌ Impossible de charger le projet.';
        }
      }
    });
  }

  loadMembres(): void {
    this.projetService.getProjectMembers(this.projectId).subscribe({
      next: data => this.membres = data,
      error: err => {
        console.error(' Erreur lors du chargement des membres :', err);
      }
    });
  }

  refreshMissions(): void {
    // MissionListComponent gère son propre rafraîchissement
  }

  onMissionsUpdated(missions: any[]): void {
    // Hook optionnel
  }

  retour(): void {
    this.router.navigate(['/dashboard-folders']);
  }
}
