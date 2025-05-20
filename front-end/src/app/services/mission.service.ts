import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Membre {
  Identifiant: number;
  Prenom: string;
  Nom: string;
  User: string;
  competences?: { id: number; nom: string }[]; // pour adéquation
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

  getMissionsByProjet(projectId: number): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl}/projets/${projectId}/missions`);
  }

  createMission(mission: Partial<Mission>): Observable<any> {
    return this.http.post(`${this.apiUrl}/missions`, mission);
  }

  deleteMission(projectId: number, missionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projets/${projectId}/missions/${missionId}`);
  }

  getPersonnelsByProjet(projectId: number): Observable<Membre[]> {
    return this.http.get<Membre[]>(`${this.apiUrl}/projets/${projectId}/personnels`);
  }

  assignPersonnelToMission(missionId: number, idPersonnel: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/missions-personnel/${missionId}/assign`,
      { idPersonnel }
    );
  }

  getMembresParMission(missionId: number): Observable<Membre[]> {
    return this.http.get<Membre[]>(`${this.apiUrl}/missions-personnel/${missionId}/personnel`);
  }

  getMembresAvecCompetences(missionId: number): Observable<Membre[]> {
    return this.http.get<Membre[]>(`${this.apiUrl}/missions-personnel/${missionId}/personnel/with-competences`);
  }

  deleteMembreDeMission(missionId: number, personnelId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/missions-personnel/${missionId}/${personnelId}`);
  }

  getCompetencesByMission(missionId: number): Observable<Competence[]> {
    return this.http.get<Competence[]>(`${this.apiUrl}/competences-missions/${missionId}/competences`);
  }

  getCompetencesRequises(missionId: number): Observable<Competence[]> {
    return this.http.get<Competence[]>(`${this.apiUrl}/competences-missions/${missionId}/competences`);
  }

  deleteCompetenceFromMission(missionId: number, competenceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/competences-missions/${missionId}/competences/${competenceId}`);
  }
}
