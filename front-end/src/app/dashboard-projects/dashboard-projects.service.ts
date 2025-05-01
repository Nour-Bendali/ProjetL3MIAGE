// src/app/dashboard-projects/dashboard-projects.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🌟 Service pour gérer les appels API liés aux projets dans le dashboard
@Injectable({
  providedIn: 'root'
})
export class DashboardProjectsService {
  // 📍 URL de base de l'API (à ajuster si nécessaire)
  private apiUrl = 'http://localhost:3000/api/projets';

  constructor(private http: HttpClient) {}

  // 📋 Créer un nouveau projet
  createProjet(projet: any): Observable<any> {
    return this.http.post(this.apiUrl, projet);
  }

  // 👥 Ajouter un membre à un projet
  addMembre(idProjet: number, idPersonnel: number, createurId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idProjet}/membres`, { idPersonnel, createurId });
  }

  // 📋 Récupérer les détails d’un projet
  getProjet(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 🗑️ Supprimer un membre d’un projet
  removeMembre(idProjet: number, idPersonnel: number, createurId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idProjet}/membres/${idPersonnel}`, {
      body: { createurId }
    });
  }
}