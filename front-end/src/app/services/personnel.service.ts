import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Personnel {
  Identifiant: number;
  Prenom: string;
  Nom: string;
  User: string;
  competences?: { Competence: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiPersonnel = 'http://localhost:3000/api/personnel';
  private apiProjets = 'http://localhost:3000/api/projets';
  private apiProjetsPersonnel = 'http://localhost:3000/api/projets-personnel';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      };
    }
    return {}; // SSR fallback : ne pas crasher
  }

  getAllPersonnel(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.apiPersonnel, this.getAuthHeaders());
  }

  getProjet(idProjet: number): Observable<{ CreateurId: number }> {
    return this.http.get<{ CreateurId: number }>(`${this.apiProjets}/${idProjet}`, this.getAuthHeaders());
  }

  getPersonnelProjet(idProjet: number): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(`${this.apiProjetsPersonnel}/${idProjet}`, this.getAuthHeaders());
  }

  ajouterPersonneAuProjet(idProjet: number, idPersonnel: number): Observable<void> {
    return this.http.post<void>(
      this.apiProjetsPersonnel,
      { IdProjet: idProjet, IdPersonnel: idPersonnel },
      this.getAuthHeaders()
    );
  }

  supprimerPersonneDuProjet(idProjet: number, idPersonnel: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiProjetsPersonnel}/${idProjet}/${idPersonnel}`,
      this.getAuthHeaders()
    );
  }
}
