import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Membre {
  Identifiant: number;
  Prenom: string;
  Nom: string;
  User: string;
}

export interface Mission {
  IdMission: number;
  NomMission: string;
  Description?: string;
  IdProjet: number;
  DateCreation: string;
  membres_assignes?: Membre[];
  competences_requises?: Competence[];
}


export interface Competence {
  IdCompetence: number;
  Competence: string;
}


@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // vos méthodes existantes
  getMissionsByProjet(projectId: number): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl}/projets/${projectId}/missions`);
  }

  createMission(mission: Partial<Mission>): Observable<any> {
    return this.http.post(`${this.apiUrl}/missions`, mission);
  }

  deleteMission(projectId: number, missionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projets/${projectId}/missions/${missionId}`);
  }

  // récupération des membres pour l’assignation
  getPersonnelsByProjet(projectId: number): Observable<Membre[]> {
    return this.http.get<Membre[]>(`${this.apiUrl}/projets/${projectId}/personnels`);
  }

  // nouvelle méthode d’assignation
  assignPersonnelToMission(missionId: number, idPersonnel: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/missions/${missionId}/assign`,
      { idPersonnel }   // ⇐ exactement ce que votre backend attend
    );
  }
  getMembresParMission(missionId: number): Observable<Membre[]> {
    return this.http.get<Membre[]>(`http://localhost:3000/api/missions/${missionId}/personnel`);
  }

  deleteMembreDeMission(missionId: number, personnelId: number): Observable<any> {
    return this.http.delete(
      `http://localhost:3000/api/missions/${missionId}/${personnelId}`
    );
  }

    // Récupérer les compétences assignées à une mission
  getCompetencesByMission(missionId: number): Observable<Competence[]> {
    return this.http.get<Competence[]>(`http://localhost:3000/api/missions/${missionId}/competences`);
  }

  // Supprimer une compétence d'une mission
  deleteCompetenceFromMission(missionId: number, competenceId: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/missions/${missionId}/competences/${competenceId}`);
  }
}
