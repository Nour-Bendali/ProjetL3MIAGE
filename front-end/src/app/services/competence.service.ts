//Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Pour effectuer des appels HTTP
import { Observable } from 'rxjs';                  // Pour gérer les réponses asynchrones

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  // URL de base de l’API. Permet de centraliser le point d’entrée vers le backend.
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste complète des compétences depuis le backend.
   */
  getAllCompetences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/competences`);
  }

  /**
   * Associe une compétence à une mission spécifique.
   * Envoie un POST au backend avec l’ID de la compétence à ajouter.
   */
  
  assignCompetenceToMission(idMission: number, idCompetence: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/competences-missions/${idMission}/competences`,
      { idCompetence }
    );
  }
}
