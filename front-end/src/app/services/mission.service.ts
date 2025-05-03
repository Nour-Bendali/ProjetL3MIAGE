import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MissionService {
  private apiUrl = '/api/missions';

  constructor(private http: HttpClient) {}

  createMission(mission: any) {
    return this.http.post(`${this.apiUrl}`, mission);
  }
}
