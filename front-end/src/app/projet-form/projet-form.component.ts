// src/app/projet-form/projet-form.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetService } from '../services/projet.service'; // Assure-toi qu’il contient bien un createProjet()

@Component({
  selector: 'app-projet-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projet-form.component.html',
  styleUrls: ['./projet-form.component.css']
})
export class ProjetFormComponent {
  nouveauProjet = {
    nomProjet: '',
    description: '',
    createurId: 1 // À remplacer par l'ID réel de l'utilisateur connecté
  };

  constructor(private projetService: ProjetService) {}

  createProjet(): void {
    if (!this.nouveauProjet.nomProjet || !this.nouveauProjet.description) {
      console.warn("⚠️ Champs requis manquants");
      return;
    }

    this.projetService.createProjet(this.nouveauProjet).subscribe({
      next: (res) => {
        console.log("✅ Projet créé :", res);
        // Tu peux rediriger ou afficher une confirmation ici
      },
      error: (err) => {
        console.error("❌ Erreur lors de la création du projet", err);
      }
    });
  }
}
