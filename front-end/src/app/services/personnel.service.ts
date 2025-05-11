// src/app/personnel/personnel.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiUrl = 'http://localhost:3000/api';
  private personnelUrl = `${this.apiUrl}/personnel`;

  constructor(private http: HttpClient) { }

  getAllPersonnel(): Observable<any> {
    return this.http.get(`${this.personnelUrl}`);
  }

  createPersonnel(personnel: any): Observable<any> {
    return this.http.post(`${this.personnelUrl}`, personnel);
  }

  deletePersonnel(id: number): Observable<any> {
    return this.http.delete(`${this.personnelUrl}/${id}`);
  }

  getProjet(projetId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projets/${projetId}`);
  }

  ajouterPersonneAuProjet(projetId: number, personnelId: number): Observable<any> {
    const createurId = localStorage.getItem('userId');
    if (!createurId) {
      throw new Error('Utilisateur non connecté');
    }
    return this.http.post(`${this.apiUrl}/projets/${projetId}/membres`, {
      idPersonnel: personnelId,
      createurId: +createurId
    });
  }

  supprimerPersonneDuProjet(projetId: number, personnelId: number): Observable<any> {
    const createurId = localStorage.getItem('userId');
    if (!createurId) {
      throw new Error('Utilisateur non connecté');
    }
    return this.http.delete(`${this.apiUrl}/projets/${projetId}/membres/${personnelId}`, {
      body: { createurId: +createurId }
    });
  }

  getPersonnelProjet(projetId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projets/${projetId}/membres`);
  }
}