// src/app/services/projet.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

/** ------------- Interfaces pour les membres et leurs compétences ------------- */
export interface Competence {
  IdCompetence: string;
  Competence:   string;
}

export interface PersonnelWithCompetences {
  Identifiant: number;
  Nom:         string;
  Prenom:      string;
  User:        string;
  competences: Competence[];
}

export interface ProjetCreate {
  nomProjet: string;
  description: string;
}
/** ------------------------------------------------------------------------------- */

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  // Base URL pour les projets
  private apiUrl = 'http://localhost:3000/api/projets';
  // URL dédiée au point d'accès "projets-personnel"
  private projetsPersonnelUrl = 'http://localhost:3000/api/projets-personnel';

  constructor(
    private http: HttpClient,
    private authService: AuthService  // inject AuthService pour récupérer le JWT
  ) {}

  // 🔹 Récupérer tous les projets
  getAllProjets(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // 🔹 Récupérer un projet par son ID
  getProjetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Récupérer missions d’un projet
  getMissionsByProjet(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/missions`);
  }

  // 🔹 Créer un nouveau projet
  createProjet(projet: ProjetCreate): Observable<any> {
    const token = this.authService.getToken();  // récupérer le JWT stocké
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(
      this.apiUrl,
      {
        nomProjet: projet.nomProjet,
        description: projet.description
      },
      { headers }
    );
  }

  // 🔹 Mettre à jour un projet existant
  updateProjet(id: number, projet: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, projet, { headers });
  }

  // 🔹 Supprimer un projet
  deleteProjet(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // 🔹 Récupérer les membres du projet avec leurs compétences
  getProjectMembers(id: number): Observable<PersonnelWithCompetences[]> {
    return this.http.get<PersonnelWithCompetences[]>(`${this.projetsPersonnelUrl}/${id}`);
  }
}
