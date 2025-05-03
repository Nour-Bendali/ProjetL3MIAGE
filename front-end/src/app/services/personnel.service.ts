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

  ajouterPersonneAuProjet(projetId: number, personnelId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/projets/${projetId}/membres`, {
      idPersonnel: personnelId,
      createurId: 1 // À remplacer par l'ID de l'utilisateur connecté
    });
  }

  getPersonnelProjet(projetId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projets/${projetId}/membres`);
  }
} 