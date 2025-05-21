import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';

/**
 * Composant qui permet d’assigner un membre du personnel à un projet spécifique.
 * Affiche une liste de projets et de personnel pour sélectionner et effectuer l’assignation.
 */
@Component({
  selector: 'app-projets-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './projets-assign.component.html',
  styleUrls: ['./projets-assign.component.css']
})
export class ProjetsAssignComponent implements OnInit {
  // Liste des projets disponibles
  projets: any[] = [];
  // Liste du personnel disponible
  personnel: any[] = [];
  // Identifiant du projet sélectionné
  selectedProjetId: number | null = null;
  // Identifiant du personnel sélectionné
  selectedPersonnelId: number | null = null;

  // Injection des dépendances pour les requêtes HTTP et l’authentification
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

 /**
   * Initialisation du composant.
   * Charge les listes des projets et du personnel lors du chargement.
   */
 ngOnInit(): void {
  this.fetchProjets();
  this.fetchPersonnel();
}

/**
 * Génère les en-têtes HTTP avec le token d’authentification.
 * @returns Les en-têtes avec le token Bearer.
 */
getHeaders(): HttpHeaders {
  const token = this.authService.getToken();
  return new HttpHeaders().set('Authorization', `Bearer ${token}`);
}


  /**
   * Récupère la liste des projets depuis l’API.
   */
  fetchProjets(): void {
    this.http.get<any[]>('http://localhost:3000/api/projets', {
      headers: this.getHeaders()
    }).subscribe({
      next: data => {
        console.log('📦 Projets chargés :', data);
        this.projets = data;
      },
      error: err => {
        console.error('❌ Erreur lors du chargement des projets', err);
        if (err.status === 401) {
          alert('🔐 Veuillez vous reconnecter.');
        } 
      }
    });
  }

  /**
   * Récupère la liste du personnel depuis l’API.
   */
  fetchPersonnel(): void {
    this.http.get<any>('http://localhost:3000/api/personnel', {
      headers: this.getHeaders()
    }).subscribe({
      next: data => {
        this.personnel = Array.isArray(data) ? data : (data.personnel ?? []);
      },
      error: err => {
        console.error('Erreur lors du chargement du personnel', err);
        if (err.status === 401) {
          alert('Veuillez vous reconnecter.');
        } else {
          alert('Erreur lors du chargement du personnel.');
        }
      }
    });
  }

  /**
   * Assigne un membre sélectionné à un projet via l’API.
   */
  assignPersonnel(): void {
    if (!this.selectedProjetId || !this.selectedPersonnelId) {
      alert('Veuillez sélectionner un projet et un membre du personnel.');
      return;
    }

    this.http.post(
      `http://localhost:3000/api/projets/${this.selectedProjetId}/personnel`,
      { idPersonnel: this.selectedPersonnelId },
      { headers: this.getHeaders() }
    ).subscribe({
      next: () => alert('Membre assigné au projet avec succès.'),
      error: err => {
        console.error('Erreur assignation membre :', err);
        if (err.status === 409) {
          alert('Ce membre fait déjà partie de ce projet.');
        } else if (err.status === 401) {
          alert('Veuillez vous reconnecter.');
        } else if (err.status === 403) {
          alert('Vous n’êtes pas autorisé à modifier ce projet.');
        } else {
          alert('Erreur lors de l’assignation.');
        }
      }
    });
  }
}
