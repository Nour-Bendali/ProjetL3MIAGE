import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PersonnelService, Personnel } from '../services/personnel.service';

/**
 * Composant qui gère l'ajout et la suppression de membres dans un projet.
 * Permet de visualiser et modifier les membres affectés ou disponibles pour un projet spécifique.
 */
@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {
  // Identifiant du projet en cours
  projectId!: number;
  // Identifiant de l'utilisateur connecté
  userId!: number;
  // Identifiant du créateur du projet
  createurId!: number;
  // Indique si l'utilisateur est le créateur du projet
  isCreator = false;

  // Liste de tous les personnels disponibles dans l'application
  allPersonnel: Personnel[] = [];
  // Liste des personnels affectés au projet
  assignedPersonnel: Personnel[] = [];
  // Liste des personnels disponibles (non affectés au projet)
  availablePersonnel: Personnel[] = [];

  // Identifiant du personnel sélectionné pour ajout
  selectedAvailablePersonnelId: number | null = null;
  // Identifiant du personnel sélectionné pour suppression
  selectedAssignedPersonnelId: number | null = null;

  // Message pour afficher les succès ou erreurs
  message = '';

  // Injection des dépendances pour la navigation et la gestion des données
  constructor(
    private route: ActivatedRoute,
    private svc: PersonnelService,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Initialisation du composant lors du chargement.
   * Récupère l'ID utilisateur, l'ID du projet, et charge les données nécessaires.
   */
  ngOnInit(): void {
    // Vérifie si l'exécution est côté navigateur pour récupérer l'ID utilisateur
    if (isPlatformBrowser(this.platformId)) {
      const uid = localStorage.getItem('userId');
      this.userId = uid ? +uid : -1;
    } else {
      this.userId = -1;
    }

    // Récupère l'ID du projet depuis les paramètres de la route
    this.projectId = +this.route.snapshot.paramMap.get('id')!;

    // Charge les détails du projet et les listes de personnel
    this.loadProjetDetails();
    this.loadAllPersonnel();
    this.loadAssignedPersonnel();
  }

  /**
   * Charge les détails du projet, notamment pour vérifier si l'utilisateur est le créateur.
   */
  private loadProjetDetails(): void {
    if (!this.projectId) return;
    this.svc.getProjet(this.projectId).subscribe({
      next: proj => {
        this.createurId = proj.CreateurId;
        this.isCreator = this.userId === this.createurId;
      },
      error: () => {
        this.message = 'Erreur lors du chargement des détails du projet.';
        alert(this.message);
      }
    });
  }

  /**
   * Charge la liste complète des personnels disponibles dans l'application.
   */
  private loadAllPersonnel(): void {
    this.svc.getAllPersonnel().subscribe({
      next: (all: Personnel[]) => {
        this.allPersonnel = all;
        this.updateAvailable();
      },
      error: () => {
        this.message = 'Erreur lors du chargement de la liste des personnels.';
        alert(this.message);
      }
    });
  }

  /**
   * Charge la liste des personnels affectés au projet.
   */
  private loadAssignedPersonnel(): void {
    this.svc.getPersonnelProjet(this.projectId).subscribe({
      next: (asg: Personnel[]) => {
        this.assignedPersonnel = asg;
        this.updateAvailable();
      },
      error: () => {
        this.message = 'Erreur lors du chargement des personnels affectés.';
        alert(this.message);
      }
    });
  }

  /**
   * Met à jour la liste des personnels disponibles (non affectés au projet).
   */
  private updateAvailable(): void {
    this.availablePersonnel = this.allPersonnel.filter(
      p => !this.assignedPersonnel.some(a => a.Identifiant === p.Identifiant)
    );
    this.selectedAvailablePersonnelId = null;
    this.selectedAssignedPersonnelId = null;
  }

  /**
   * Ajoute un membre sélectionné au projet.
   */
  addMember(): void {
    const id = this.selectedAvailablePersonnelId;
    if (!id) {
      this.message = 'Veuillez sélectionner un membre à ajouter.';
      alert(this.message);
      return;
    }
    this.svc.ajouterPersonneAuProjet(this.projectId, id).subscribe({
      next: () => {
        this.message = 'Membre ajouté avec succès.';
        alert(this.message);
        this.loadAssignedPersonnel();
      },
      error: () => {
        this.message = 'Erreur lors de l’ajout du membre.';
        alert(this.message);
      }
    });
  }

  /**
   * Supprime un membre sélectionné du projet.
   */
  removeMember(): void {
    const id = this.selectedAssignedPersonnelId;
    if (!id) {
      this.message = 'Veuillez sélectionner un membre à supprimer.';
      alert(this.message);
      return;
    }
    if (!confirm('Confirmez la suppression ?')) return;
    this.svc.supprimerPersonneDuProjet(this.projectId, id).subscribe({
      next: () => {
        this.message = 'Membre supprimé avec succès.';
        alert(this.message);
        this.loadAssignedPersonnel();
      },
      error: () => {
        this.message = 'Erreur lors de la suppression du membre.';
        alert(this.message);
      }
    });
  }

  /**
   * Retourne à la page précédente.
   */
  goBack(): void {
    this.location.back();
  }
}