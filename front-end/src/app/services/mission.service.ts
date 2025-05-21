// src/app/services/mission.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

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
  Competence:   string;
}

export interface Mission {
  IdMission:           number;
  Titre:               string;
  Description?:        string;
  IdProjet:            number;
  DateCreation:        string;
  membres_assignes?:   Membre[];
  competences_requises?: Competence[];
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** 🔹 Récupérer toutes les missions d’un projet */
  getMissionsByProjet(projectId: number): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.baseUrl}/projets/${projectId}/missions`);
  }

  /** 🔹 Créer une mission */
  createMission(mission: Partial<Mission>): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/missions`, mission, { headers });
  }

  /** 🔹 Supprimer une mission */
  deleteMission(projectId: number, missionId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(
      `${this.baseUrl}/projets/${projectId}/missions/${missionId}`,
      { headers }
    );
  }

  /** 🔹 Récupérer membres assignés d’une mission */
  getMembresParMission(missionId: number): Observable<Membre[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Membre[]>(
      `${this.baseUrl}/missions-personnel/${missionId}/personnel`,
      { headers }
    );
  }

  /** 🔹 Retirer un membre d’une mission */
  deleteMembreDeMission(missionId: number, personnelId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(
      `${this.baseUrl}/missions-personnel/${missionId}/${personnelId}`,
      { headers }
    );
  }

  /** 🔹 Récupérer compétences requises d’une mission */
  getCompetencesByMission(missionId: number): Observable<Competence[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Competence[]>(
      // Updated: include `/competences` to match backend route
      `${this.baseUrl}/competences-missions/${missionId}/competences`,
      { headers }
    );
  }

  /** 🔹 Supprimer une compétence d’une mission */
  deleteCompetenceFromMission(missionId: number, competenceId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(
      `${this.baseUrl}/competences-missions/${missionId}/competences/${competenceId}`,
      { headers }
    );
  }

  /** 🔹 Récupérer les membres assignés à une mission AVEC leurs compétences */
getMembresAvecCompetences(missionId: number): Observable<Membre[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<Membre[]>(
    `${this.baseUrl}/missions-personnel/${missionId}/personnel/with-competences`,
    { headers }
  );
}

/** 🔹 Récupérer uniquement les compétences REQUISES d'une mission (≠ de getCompetencesByMission) */
getCompetencesRequises(missionId: number): Observable<Competence[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<Competence[]>(
    `${this.baseUrl}/competences-missions/${missionId}/competences`,
    { headers }
  );
}
}
