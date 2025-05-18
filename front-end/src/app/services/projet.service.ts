// src/app/services/projet.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
/** ------------------------------------------------------------------------------- */

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  // Base URL pour les projets
  private apiUrl = 'http://localhost:3000/api/projets';
  // URL dédiée au point d'accès "projets-personnel"
  private projetsPersonnelUrl = 'http://localhost:3000/api/projets-personnel';

  constructor(private http: HttpClient) {}

  // 🔹 Récupérer tous les projets
  getAllProjets(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 🔹 Récupérer un projet par son ID
  getProjetById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 🔹 Créer un nouveau projet
  createProjet(projet: any): Observable<any> {
    return this.http.post(this.apiUrl, projet);
  }

  // 🔹 Mettre à jour un projet existant
  updateProjet(id: number, projet: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, projet);
  }

  // 🔹 Supprimer un projet
  deleteProjet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 🔹 Nouveau: récupérer les membres du projet avec leurs compétences
  //     Utilise le bon endpoint monté en backend : /api/projets-personnel/:id
  getProjectMembers(id: number): Observable<PersonnelWithCompetences[]> {
    return this.http.get<PersonnelWithCompetences[]>(`${this.projetsPersonnelUrl}/${id}`);
  }
}
