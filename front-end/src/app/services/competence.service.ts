import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAllCompetences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/competences`);
  }

  assignCompetenceToMission(idMission: number, idCompetence: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/competences-missions/${idMission}/competences`, { idCompetence });
  }
}
