// src/app/projet/projet.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { MissionFormComponent } from '../mission-form/mission-form.component';

@Component({
  selector: 'app-projet',
  standalone: true,
  imports: [CommonModule, RouterModule, MissionFormComponent],
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {
  projet: any = null;
  projectId!: number; 
  errorMessage: string | null = null;
  missions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProjet();
    this.loadMissions();
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
      .get<any>(`http://localhost:3000/api/projets/${this.projectId}`)
      .subscribe({
        next: project => {
          this.projet = project;
          console.log('✅ Projet chargé', this.projet);
          this.refreshMissions();
        },
        error: err => {
          console.error('❌ Erreur lors du chargement du projet', err);
          this.errorMessage = 'Impossible de charger le projet. Veuillez réessayer plus tard.';
        }
      });
  }

  loadMissions(): void {
    if (!this.projectId) return;

    this.http
      .get<any[]>(`http://localhost:3000/api/projets/${this.projectId}/missions`)
      .subscribe({
        next: data => {
          this.missions = data;
          console.log('📌 Missions chargées :', this.missions);
        },
        error: err => {
          console.error('❌ Erreur lors du chargement des missions', err);
        }
      });
  }
  
  refreshMissions(): void {
    if (!this.projectId) return;

    this.http
      .get<any[]>(`http://localhost:3000/api/projets/${this.projectId}/missions`)
      .subscribe({
        next: data => {
          this.projet.missions = data;
        },
        error: err => {
          console.error('❌ Erreur lors du rafraîchissement des missions', err);
        }
      });
  }
}
