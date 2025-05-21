import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProjetService } from '../services/projet.service';
import { MissionListComponent } from '../mission-list/mission-list.component';
import { MissionFormComponent } from '../mission-form/mission-form.component';

/**
 * Composant qui affiche les détails d’un projet spécifique.
 * Permet de consulter les informations du projet, ses membres, ses missions,
 * et d’ajouter de nouvelles missions ou gérer les membres.
 */
@Component({
  selector: 'app-projet',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MissionListComponent,
    MissionFormComponent
  ],
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {
  // Identifiant du projet en cours
  projectId!: number;
  // Données du projet chargé depuis l’API
  projet: any;
  // Liste des membres associés au projet
  membres: any[] = [];
  // Message d’erreur en cas de problème de chargement
  errorMessage: string | null = null;

  // Injection des dépendances pour la navigation et la gestion des données
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetService: ProjetService
  ) {}

  /**
   * Initialisation du composant lors du chargement.
   * Récupère l’ID du projet depuis l’URL et charge les données.
   */
  ngOnInit(): void {
    // Récupère l’ID du projet depuis les paramètres de la route
    const idParam = this.route.snapshot.paramMap.get('id');

    // Vérifie si l’ID est absent
    if (!idParam) {
      this.errorMessage = 'Aucun ID de projet fourni.';
      return;
    }

    // Convertit l’ID en nombre et vérifie sa validité
    const parsedId = parseInt(idParam, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      this.errorMessage = 'ID de projet invalide.';
      return;
    }

    this.projectId = parsedId;
    // Charge les détails du projet et ses membres
    this.loadProjet();
    this.loadMembres();
  }

  /**
   * Charge les détails du projet depuis l’API.
   */
  loadProjet(): void {
    this.projetService.getProjetById(this.projectId).subscribe({
      next: data => {
        this.projet = data;
        this.errorMessage = null; // Réinitialise le message d’erreur
      },
      error: err => {
        console.error('Erreur lors du chargement du projet :', err);
        // Gère les erreurs selon le code de statut HTTP
        if (err.status === 403) {
          this.errorMessage = 'Vous n’avez pas accès à ce projet. Vous n’êtes ni membre ni créateur de ce projet.';
        } else if (err.status === 404) {
          this.errorMessage = 'Projet introuvable.';
        } else {
          this.errorMessage = 'Impossible de charger le projet.';
        }
      }
    });
  }

  /**
   * Charge la liste des membres associés au projet.
   */
  loadMembres(): void {
    this.projetService.getProjectMembers(this.projectId).subscribe({
      next: data => this.membres = data,
      error: err => {
        console.error('Erreur lors du chargement des membres :', err);
      }
    });
  }

  /**
   * Rafraîchit la liste des missions après un événement (par exemple, création d’une mission).
   */
  refreshMissions(): void {
    // MissionListComponent gère son propre rafraîchissement
  }

  /**
   * Gère les mises à jour de la liste des missions via un événement.
   * @param missions Liste des missions mises à jour
   */
  onMissionsUpdated(missions: any[]): void {
    // Hook optionnel pour des actions supplémentaires
  }

  /**
   * Retourne au tableau de bord.
   */
  retour(): void {
    this.router.navigate(['/dashboard-folders']);
  }
}