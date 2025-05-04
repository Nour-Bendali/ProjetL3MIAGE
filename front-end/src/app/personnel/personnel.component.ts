// src/app/personnel/personnel.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {
  // Liste des membres
  personnelList: any[] = [];
  filteredPersonnel: any[] = [];

  // Données pour ajouter ou modifier un membre
  newPersonnel = { prenom: '', nom: '', email: '', password: '' };
  editPersonnel: any = null; // Pour stocker le membre en cours de modification

  // Champ de recherche
  searchQuery: string = '';

  // Message d’erreur ou de succès
  message: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPersonnel();
  }

  // Charger la liste des membres
  loadPersonnel(): void {
    this.http.get('http://localhost:3000/api/personnel').subscribe({
      next: (data: any) => {
        this.personnelList = data;
        this.filteredPersonnel = data;
        console.log('✅ Liste des membres chargée', this.personnelList);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des membres', error);
        this.message = 'Erreur lors du chargement des membres.';
      }
    });
  }

  // Filtrer la liste selon la recherche
  filterPersonnel(): void {
    if (!this.searchQuery) {
      this.filteredPersonnel = this.personnelList;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredPersonnel = this.personnelList.filter(person =>
        person.Prenom.toLowerCase().includes(query) ||
        person.Nom.toLowerCase().includes(query) ||
        person.User.toLowerCase().includes(query)
      );
    }
  }

  // Ajouter un nouveau membre
  addPersonnel(): void {
    if (!this.newPersonnel.prenom || !this.newPersonnel.nom || !this.newPersonnel.email || !this.newPersonnel.password) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }

    this.http.post('http://localhost:3000/api/personnel', this.newPersonnel).subscribe({
      next: (response: any) => {
        console.log('✅ Membre ajouté', response);
        this.message = 'Membre ajouté avec succès.';
        this.newPersonnel = { prenom: '', nom: '', email: '', password: '' }; // Réinitialiser le formulaire
        this.loadPersonnel(); // Recharger la liste
      },
      error: (error) => {
        console.error('❌ Erreur lors de l’ajout', error);
        this.message = 'Erreur lors de l’ajout du membre.';
      }
    });
  }

  // Préparer la modification d’un membre
  startEdit(person: any): void {
    this.editPersonnel = { ...person }; // Copie pour éviter de modifier directement
  }

  // Enregistrer les modifications
  saveEdit(): void {
    if (!this.editPersonnel.Prenom || !this.editPersonnel.Nom || !this.editPersonnel.User) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }

    this.http.put(`http://localhost:3000/api/personnel/${this.editPersonnel.Identifiant}`, this.editPersonnel).subscribe({
      next: () => {
        console.log('✅ Membre modifié');
        this.message = 'Membre modifié avec succès.';
        this.editPersonnel = null; // Sortir du mode modification
        this.loadPersonnel(); // Recharger la liste
      },
      error: (error) => {
        console.error('❌ Erreur lors de la modification', error);
        this.message = 'Erreur lors de la modification du membre.';
      }
    });
  }

  // Supprimer un membre
  deletePersonnel(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      this.http.delete(`http://localhost:3000/api/personnel/${id}`).subscribe({
        next: () => {
          console.log('✅ Membre supprimé');
          this.message = 'Membre supprimé avec succès.';
          this.loadPersonnel(); // Recharger la liste
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression', error);
          this.message = 'Erreur lors de la suppression du membre.';
        }
      });
    }
  }

  // Annuler la modification
  cancelEdit(): void {
    this.editPersonnel = null;
    this.message = '';
  }
}