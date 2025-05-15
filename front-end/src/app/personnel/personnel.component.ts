// src/app/personnel/personnel.component.ts

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core'; // Ajoute PLATFORM_ID et Inject
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PersonnelService } from '../services/personnel.service';
import { HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common'; // Ajoute isPlatformBrowser

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
  allPersonnel: any[] = [];
  selectedPersonnelId: number | null = null;
  editPersonnel: any = null;
  searchQuery: string = '';
  competenceQuery: string = '';
  message: string = '';
  projectId: number | null = null;
  userId: number | null = null;
  createurId: number | null = null;
  isCreator: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private personnelService: PersonnelService,
    @Inject(PLATFORM_ID) private platformId: Object // Injecte PLATFORM_ID
  ) {}

  ngOnInit(): void {
    // Vérifie si on est côté client avant d'accéder à localStorage
    if (isPlatformBrowser(this.platformId)) {
      const storedUserId = localStorage.getItem('userId');
      this.userId = storedUserId ? +storedUserId : null;
    } else {
      this.userId = null; // Valeur par défaut en SSR
    }

    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      if (this.projectId) {
        this.loadProjetDetails();
        this.loadPersonnel();
        this.loadAllPersonnel();
      } else {
        this.message = 'ID du projet non spécifié.';
      }
    });
  }

  loadProjetDetails(): void {
    if (!this.projectId) return;
  
    this.personnelService.getProjet(this.projectId).subscribe({
      next: (response: any) => {
        if (response && response.CreateurId !== undefined) {
          this.createurId = response.CreateurId;
          this.isCreator = this.userId === this.createurId;
          console.log(`✅ Projet chargé, créateur: ${this.createurId}, utilisateur connecté: ${this.userId}, est créateur: ${this.isCreator}`);
        } else {
          console.error('❌ Réponse inattendue :', response);
          this.message = 'Projet invalide.';
          this.createurId = null;
          this.isCreator = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur :', error);
        this.message = 'Erreur lors du chargement du projet.';
        this.createurId = null;
        this.isCreator = false;
      }
    });
  }

  loadPersonnel(): void {
    if (!this.projectId) return;

    this.personnelService.getPersonnelProjet(this.projectId).subscribe({
      next: (data: any) => {
        this.personnelList = data;
        this.filteredPersonnel = data;
        console.log('✅ Membres du projet chargés avec compétences', this.personnelList);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur lors du chargement des membres', error);
        this.message = 'Erreur lors du chargement des membres.';
      }
    });
  }

  loadAllPersonnel(): void {
    this.personnelService.getAllPersonnel().subscribe({
      next: (data: any) => {
        this.allPersonnel = data;
        console.log('✅ Tous les membres chargés', this.allPersonnel);
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur lors du chargement de tous les membres', error);
        this.message = 'Erreur lors du chargement de tous les membres.';
      }
    });
  }

  filterPersonnel(): void {
    this.filteredPersonnel = this.personnelList;

    // Filtrer par recherche générale (Prénom, Nom, Email)
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      this.filteredPersonnel = this.filteredPersonnel.filter(person =>
        person.Prenom.toLowerCase().includes(query) ||
        person.Nom.toLowerCase().includes(query) ||
        person.User.toLowerCase().includes(query)
      );
    }

    // Filtrer par compétence
    if (this.competenceQuery) {
      const compQuery = this.competenceQuery.toLowerCase();
      this.filteredPersonnel = this.filteredPersonnel.filter(person =>
        person.Competences?.toLowerCase().includes(compQuery)
      );
    }
  }

  addSelectedPersonnel(): void {
    if (!this.isCreator) {
      this.message = 'Seul le créateur du projet peut ajouter des membres.';
      return;
    }

    if (!this.selectedPersonnelId || !this.projectId) {
      this.message = 'Veuillez sélectionner un membre.';
      return;
    }

    this.personnelService.ajouterPersonneAuProjet(this.projectId, this.selectedPersonnelId).subscribe({
      next: () => {
        console.log('✅ Membre ajouté au projet');
        this.message = 'Membre ajouté avec succès.';
        this.selectedPersonnelId = null;
        this.loadPersonnel();
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Erreur lors de l’ajout au projet', error);
        this.message = error.error?.error || 'Erreur lors de l’ajout du membre au projet.';
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