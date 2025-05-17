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
  competences_requises?: string[];
}

@Injectable({ providedIn: 'root' })
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
  
}
