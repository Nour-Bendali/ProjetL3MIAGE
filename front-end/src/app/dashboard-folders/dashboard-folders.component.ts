// src/app/dashboard-folders/dashboard-folders.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjetService } from '../services/projet.service';
import { ProjetsFormComponent } from '../projets-form/projets-form.component';

@Component({
  selector: 'app-dashboard-folders',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjetsFormComponent],
  templateUrl: './dashboard-folders.component.html',
  styleUrls: ['./dashboard-folders.component.css']
})
export class DashboardFoldersComponent implements OnInit {
  projets: any[] = [];

  constructor(private projetService: ProjetService) {}

  ngOnInit(): void {
    this.LoadProjets();
  }

  LoadProjets(): void {
    this.projetService.getAllProjets().subscribe({
      next: data => {
        this.projets = data;
      },
      error: err => {
        console.error('Erreur lors du chargement des projets :', err);
      }
    });
  }

  supprimerProjet(id: number): void {
    console.log('ID à supprimer :', id);
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      this.projetService.deleteProjet(id).subscribe({
        next: () => {
          this.projets = this.projets.filter(p => p.IdProjet !== id);
          alert('Projet supprimé avec succès.');
        },
        error: err => {
          console.error('Erreur lors de la suppression :', err);
  
          // 🔒 Cas 1 : utilisateur non créateur → erreur 403
          if (err.status === 403) {
            alert('⛔ Vous n’êtes pas autorisé à supprimer ce projet.');
          }
  
          // 🔗 Cas 2 : contrainte d’intégrité (membres assignés)
          else if (err.status === 500 && err.error?.error?.includes('constraint fails')) {
            alert('Impossible de supprimer le projet : des membres y sont encore affectés.');
          }
  
          // 🔁 Cas 3 : projet inexistant
          else if (err.status === 404) {
            alert('📁 Ce projet n’existe plus ou a déjà été supprimé.');
          }
  
          // ❌ Cas 4 : autre erreur serveur générique
          else {
            alert('❌ Une erreur est survenue. Veuillez réessayer.');
          }
        }
      });
    }
  }
}
