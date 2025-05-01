// src/app/dashboard-projects/dashboard-projects.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 📋 Ajout pour *ngIf et *ngFor
import { FormsModule } from '@angular/forms'; // 📋 Ajout pour ngModel
import { DashboardProjectsService } from './dashboard-projects.service';

// 🌟 Composant pour gérer les projets dans le dashboard
@Component({
  selector: 'app-dashboard-projects',
  standalone: true, // 📋 Indique que ce composant est standalone
  imports: [CommonModule, FormsModule], // 📋 Importe les modules nécessaires
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.css']
})
export class DashboardProjectsComponent implements OnInit {
  // 📋 Données du formulaire pour créer un nouveau projet
  nouveauProjet = { nomProjet: '', description: '', createurId: 1 }; // ⚠️ createurId temporaire (à remplacer par l'utilisateur connecté)
  projet: any = null; // 📋 Données du projet chargé
  idProjet: number | null = null; // 📍 ID du projet à afficher (à ajuster selon la navigation)

  // 🛠️ Variables pour ajouter un membre
  idPersonnelToAdd: number | null = null;

  constructor(private dashboardProjectsService: DashboardProjectsService) {}

  ngOnInit(): void {
    // 📍 Charger un projet existant si un ID est disponible (par exemple, via un paramètre de route)
    // Pour l'instant, on peut tester avec un ID fixe
    this.idProjet = 1; // ⚠️ À remplacer par une récupération dynamique
    if (this.idProjet !== null) { // ✅ Vérification que idProjet n’est pas null
      this.loadProjet(this.idProjet);
    }
  }

  // 📋 Créer un nouveau projet
  createProjet(): void {
    this.dashboardProjectsService.createProjet(this.nouveauProjet).subscribe({
      next: (response: { id: number, nomProjet: string, description: string }) => { // ✅ Typage explicite de response
        console.log('✅ Projet créé avec succès', response);
        this.idProjet = response.id; // 📍 idProjet est maintenant un number
        if (this.idProjet !== null) { // ✅ Vérification supplémentaire pour TypeScript
          this.loadProjet(this.idProjet);
        }
      },
      error: (error) => console.error('❌ Erreur lors de la création', error)
    });
  }

  // 👥 Ajouter un membre au projet
  addMembre(): void {
    // ✅ Vérification que idProjet et idPersonnelToAdd ne sont pas null
    if (this.idProjet === null || this.idPersonnelToAdd === null) {
      console.error('❌ ID du projet ou ID du membre manquant');
      return;
    }
    // 📍 idProjet est garanti d’être un number ici (vérifié ci-dessus)
    const projetId: number = this.idProjet; // ✅ Assertion explicite pour TypeScript
    this.dashboardProjectsService.addMembre(projetId, this.idPersonnelToAdd, this.nouveauProjet.createurId).subscribe({
      next: () => {
        console.log('✅ Membre ajouté');
        this.loadProjet(projetId); // ✅ Utilisation de projetId
        this.idPersonnelToAdd = null; // 📍 Réinitialiser le champ
      },
      error: (error) => console.error('❌ Erreur lors de l’ajout', error)
    });
  }

  // 🗑️ Supprimer un membre du projet
  removeMembre(idPersonnel: number): void {
    // ✅ Vérification que idProjet n’est pas null
    if (this.idProjet === null) {
      console.error('❌ ID du projet manquant');
      return;
    }
    // 📍 idProjet est garanti d’être un number ici (vérifié ci-dessus)
    const projetId: number = this.idProjet; // ✅ Assertion explicite pour TypeScript
    this.dashboardProjectsService.removeMembre(projetId, idPersonnel, this.nouveauProjet.createurId).subscribe({
      next: () => {
        console.log('✅ Membre supprimé');
        this.loadProjet(projetId); // ✅ Utilisation de projetId
      },
      error: (error) => console.error('❌ Erreur lors de la suppression', error)
    });
  }

  // 📋 Charger les détails d’un projet
  loadProjet(id: number): void {
    this.dashboardProjectsService.getProjet(id).subscribe({
      next: (data) => {
        this.projet = data;
        console.log('✅ Projet chargé', this.projet);
      },
      error: (error) => console.error('❌ Erreur lors du chargement', error)
    });
  }
}
