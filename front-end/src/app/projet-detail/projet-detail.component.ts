import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardProjectsService } from '../dashboard-projects/dashboard-projects.service';


@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projet-detail.component.html',
  styleUrls: ['./projet-detail.component.css']
})
export class ProjetDetailComponent implements OnInit {
  projet: any = null;
  idProjet: number | null = null;
  idPersonnelToAdd: number | null = null;
  createurId = 1; // 🔁 à remplacer par l'utilisateur connecté

  constructor(
    private route: ActivatedRoute,
    private dashboardProjectsService: DashboardProjectsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idProjet = +params['id'];
      if (this.idProjet) {
        this.loadProjet(this.idProjet);
      }
    });
  }

  loadProjet(id: number): void {
    this.dashboardProjectsService.getProjet(id).subscribe({
      next: (data) => {
        this.projet = data;
        console.log('✅ Projet chargé', this.projet);
      },
      error: (error) => console.error('❌ Erreur lors du chargement', error)
    });
  }

  addMembre(): void {
    if (this.idProjet === null || this.idPersonnelToAdd === null) {
      console.error('❌ ID du projet ou du membre manquant');
      return;
    }

    this.dashboardProjectsService.addMembre(this.idProjet, this.idPersonnelToAdd, this.createurId).subscribe({
      next: () => {
        console.log('✅ Membre ajouté');
        this.loadProjet(this.idProjet!);
        this.idPersonnelToAdd = null;
      },
      error: (error) => console.error('❌ Erreur lors de l’ajout', error)
    });
  }

  removeMembre(idPersonnel: number): void {
    if (this.idProjet === null) {
      console.error('❌ ID du projet manquant');
      return;
    }

    this.dashboardProjectsService.removeMembre(this.idProjet, idPersonnel, this.createurId).subscribe({
      next: () => {
        console.log('✅ Membre supprimé');
        this.loadProjet(this.idProjet!);
      },
      error: (error) => console.error('❌ Erreur lors de la suppression', error)
    });
  }
}
