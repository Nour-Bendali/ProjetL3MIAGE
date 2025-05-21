// Imports
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';            // Pour vérifier si on est côté client
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Personnel {
  Identifiant: number;
  Prenom: string;
  Nom: string;
  User: string;
  competences?: { Competence: string }[]; 
}

@Injectable({ providedIn: 'root' })
export class PersonnelService {
  // ===== POINTS D'ACCÈS À L'API =====
  private apiPersonnel = 'http://localhost:3000/api/personnel';
  private apiProjets = 'http://localhost:3000/api/projets';
  private apiProjetsPersonnel = 'http://localhost:3000/api/projets-personnel';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Si on est en navigateur, on lit le token depuis localStorage
   * et on construit l’objet options avec les headers.
   * En SSR, retourne un objet vide pour éviter les erreurs.
   */

  private getAuthHeaders() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
      };
    }
    return {};
  }


  /** 🔹 Récupérer tout le personnel */
  getAllPersonnel(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.apiPersonnel, this.getAuthHeaders());
  }

  /** 🔹 Récupérer les détails d’un projet (notamment CreateurId) */
  getProjet(idProjet: number): Observable<{ CreateurId: number }> {
    return this.http.get<{ CreateurId: number }>(
      `${this.apiProjets}/${idProjet}`,
      this.getAuthHeaders()
    );
  }

  /** 🔹 Récupérer le personnel affecté à un projet */
  getPersonnelProjet(idProjet: number): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(
      `${this.apiProjetsPersonnel}/${idProjet}`,
      this.getAuthHeaders()
    );
  }

  /** 🔹 Ajouter un membre à un projet */
  ajouterPersonneAuProjet(idProjet: number, idPersonnel: number): Observable<void> {
    return this.http.post<void>(
      this.apiProjetsPersonnel,
      { IdProjet: idProjet, IdPersonnel: idPersonnel },
      this.getAuthHeaders()
    );
  }

  /** 🔹 Retirer un membre d’un projet */
  supprimerPersonneDuProjet(idProjet: number, idPersonnel: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiProjetsPersonnel}/${idProjet}/${idPersonnel}`,
      this.getAuthHeaders()
    );
  }
}
