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
      next: (data) => {
        this.projets = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des projets :", err);
      }
    });
  }
  supprimerProjet(id: number): void {
    console.log('ID à supprimer :', id); // 👈 vérifie ce qui sort ici
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      this.projetService.deleteProjet(id).subscribe({
        next: () => {
          this.projets = this.projets.filter(p => p.IdProjet !== id);
          alert('Projet supprimé avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Erreur serveur.');
        }
      });
    }
  }
} 
