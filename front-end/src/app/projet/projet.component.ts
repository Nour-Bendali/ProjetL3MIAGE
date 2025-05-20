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
    MissionListComponent,    // Added: mission list sub-component
    MissionFormComponent     // Added: mission form sub-component
  ],
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {
  projectId!: number;                       // Added: store route ID
  projet: any;                              // Added: project details
  membres: any[] = [];                      // Added: project members
  errorMessage: string | null = null;       // Added: error handling

  constructor(
    private route: ActivatedRoute,          // Added: to read route params
    private router: Router,                 // Added: to navigate back
    private projetService: ProjetService    // Added: to fetch data
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.errorMessage = 'ID du projet invalide ou manquant.'; // Added
      return;
    }
    this.projectId = +idParam;
    this.loadProjet();
    this.loadMembres();
  }

  loadProjet(): void {
    this.projetService.getProjetById(this.projectId).subscribe({
      next: data => this.projet = data,                                     // Added
      error: () => this.errorMessage = 'Impossible de charger le projet.'    // Added
    });
  }

  loadMembres(): void {
    this.projetService.getProjectMembers(this.projectId).subscribe({
      next: data => this.membres = data,                                    // Added
      error: err => console.error('❌ Erreur chargement membres', err)       // Added
    });
  }

  refreshMissions(): void {
    // Called when a new mission is created to refresh list
    // No-op here; MissionListComponent handles its own refresh
  }

  onMissionsUpdated(missions: any[]): void {
    // Optional: respond to missionsUpdated event
  }

  retour(): void {
    this.router.navigate(['/dashboard-folders']); // Added: back to dashboard
  }
}
