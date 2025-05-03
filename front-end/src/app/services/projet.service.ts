// src/app/services/projet.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private apiUrl = 'http://localhost:3000/api/projets';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les projets
  getAllProjets(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // ✅ Récupérer un projet par son ID
  getProjetById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ✅ Créer un nouveau projet
  createProjet(projet: any): Observable<any> {
    return this.http.post(this.apiUrl, projet);
  }

  // ✅ Mettre à jour un projet existant
  updateProjet(id: number, projet: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, projet);
  }

  // ✅ Supprimer un projet
  deleteProjet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
