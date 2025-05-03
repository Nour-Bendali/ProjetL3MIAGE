// src/app/projet/projet.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-projet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {
  projet: any = null;
  projectId: number | null = null;
  errorMessage: string | null = null; // Nouvelle propriété pour l’erreur

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProjet();
  }

  loadProjet(): void {
    if (this.projectId) {
      this.http.get(`http://localhost:3000/api/projets/${this.projectId}`).subscribe({
        next: (data: any) => {
          this.projet = data;
          console.log('✅ Projet chargé', this.projet);
        },
        error: (error) => {
          console.error('❌ Erreur lors du chargement du projet', error);
          this.errorMessage = 'Impossible de charger le projet. Veuillez réessayer plus tard.';
        }
      });
    }
  }

  openProjetForm(): void {
    if (this.projectId) {
      this.router.navigate([`/projet-form/${this.projectId}`]);
    }
  }
}