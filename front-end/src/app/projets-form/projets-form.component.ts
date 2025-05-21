// Imports
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterModule } from '@angular/router';     
import { FormsModule } from '@angular/forms';
import { ProjetService, ProjetCreate } from '../services/projet.service'; 

@Component({
  selector: 'app-projets-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './projets-form.component.html',
  styleUrls: ['./projets-form.component.css']
})
export class ProjetsFormComponent implements OnInit {
  nouveauProjet: ProjetCreate = { nomProjet: '', description: '' };
  // Tableau pour stocker et afficher la liste des projets existants
  projets: any[] = [];

  constructor(private projetService: ProjetService) {}

  /** Au démarrage du composant, on charge la liste des projets */
  ngOnInit(): void {
    this.loadProjets();
  }


  /**
   * - En cas de succès : on stocke les données dans `projets`
   * - En cas d’erreur : log dans la console
   */

  loadProjets(): void {
    this.projetService.getAllProjets().subscribe({
      next: (data: any) => {
        this.projets = data;
      },
      error: (error: any) => console.error('❌ Erreur lors du chargement des projets', error)
    });
  }

  /**
   * - Si succès : alerte, réinitialisation du formulaire et rechargement de la liste
   * - Si erreur : alerte et log
   */
  createProjet(): void {
    this.projetService.createProjet(this.nouveauProjet).subscribe({
      next: (response: any) => {
        alert('✅ Projet créé avec succès !');
        console.log('✅ Projet créé avec succès', response);
        this.nouveauProjet.nomProjet = '';
        this.nouveauProjet.description = '';
        this.loadProjets();
      },
      error: (error: any) => {
        alert('❌ Erreur lors de la création du projet.');
        console.error('❌ Erreur lors de la création', error);
      }
    });
  }
}
