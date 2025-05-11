// src/app/personnel/personnel.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PersonnelService } from '../services/personnel.service'; // Chemin corrigé
import { HttpErrorResponse } from '@angular/common/http'; // Pour typer l'erreur

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {
  personnelList: any[] = [];
  filteredPersonnel: any[] = [];
  newPersonnel = { prenom: '', nom: '', User: '', password: '' };
  editPersonnel: any = null;
  searchQuery: string = '';
  message: string = '';
  projectId: number | null = null;
  userId: number | null = null; // ID de l'utilisateur connecté
  createurId: number | null = null; // ID du créateur du projet
  isCreator: boolean = false; // Ajout explicite de la propriété

  constructor(
    private route: ActivatedRoute,
    private personnelService: PersonnelService // Injection du service
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur connecté
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? +storedUserId : null;

    // Récupérer IdProjet depuis l'URL
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.loadProjetDetails();
        this.loadPersonnel();
      } else {
        this.message = 'ID du projet non spécifié.';
      }
    });
  }

  loadProjetDetails(): void {
    if (!this.projectId) return;

    this.personnelService.getProjet(this.projectId).subscribe({
      next: (response: any) => {
        this.createurId = response.projet.CreateurId;
        this.isCreator = this.userId === this.createurId;
        console.log(`✅ Projet chargé, créateur: ${this.createurId}, utilisateur connecté: ${this.userId}, est créateur: ${this.isCreator}`);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur lors du chargement des détails du projet', error);
        this.message = 'Erreur lors du chargement des détails du projet.';
      }
    });
  }

  loadPersonnel(): void {
    if (!this.projectId) return;

    this.personnelService.getPersonnelProjet(this.projectId).subscribe({
      next: (data: any) => {
        this.personnelList = data;
        this.filteredPersonnel = data;
        console.log('✅ Membres du projet chargés', this.personnelList);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur lors du chargement des membres', error);
        this.message = 'Erreur lors du chargement des membres.';
      }
    });
  }

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

  addPersonnel(): void {
    if (!this.newPersonnel.prenom || !this.newPersonnel.nom || !this.newPersonnel.User || !this.newPersonnel.password) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }

    if (!this.isCreator) {
      this.message = 'Seul le créateur du projet peut ajouter des membres.';
      return;
    }

    this.personnelService.createPersonnel(this.newPersonnel).subscribe({
      next: (response: any) => {
        console.log('✅ Membre ajouté', response);
        this.message = 'Membre ajouté avec succès.';
        this.newPersonnel = { prenom: '', nom: '', User: '', password: '' };
        this.loadPersonnel();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur lors de l’ajout', error);
        this.message = 'Erreur lors de l’ajout du membre.';
      }
    });
  }

  startEdit(person: any): void {
    this.editPersonnel = { ...person };
  }

  saveEdit(): void {
    if (!this.editPersonnel.Prenom || !this.editPersonnel.Nom || !this.editPersonnel.User) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }

    this.personnelService.createPersonnel(this.editPersonnel).subscribe({
      next: () => {
        console.log('✅ Membre modifié');
        this.message = 'Membre modifié avec succès.';
        this.editPersonnel = null;
        this.loadPersonnel();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur lors de la modification', error);
        this.message = 'Erreur lors de la modification du membre.';
      }
    });
  }

  deletePersonnel(id: number): void {
    if (!this.isCreator) {
      this.message = 'Seul le créateur du projet peut supprimer des membres.';
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      if (!this.projectId) return;

      this.personnelService.supprimerPersonneDuProjet(this.projectId, id).subscribe({
        next: () => {
          console.log('✅ Membre supprimé');
          this.message = 'Membre supprimé avec succès.';
          this.loadPersonnel();
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Erreur lors de la suppression', error);
          this.message = error.error?.error || 'Erreur lors de la suppression du membre.';
        }
      });
    }
  }

  cancelEdit(): void {
    this.editPersonnel = null;
    this.message = '';
  }
}