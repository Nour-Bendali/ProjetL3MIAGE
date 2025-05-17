import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Personnel {
  Identifiant: number;
  Prenom:      string;
  Nom:         string;
  User:        string;
  competences?: { Competence: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiPersonnel         = 'http://localhost:3000/api/personnel';
  private apiProjets           = 'http://localhost:3000/api/projets';
  private apiProjetsPersonnel  = 'http://localhost:3000/api/projets-personnel';

  constructor(private http: HttpClient) {}

  /** 1) Lista global de usuarios */
  getAllPersonnel(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.apiPersonnel);
  }

  /** 2) Obtiene el proyecto (para comprobar creador) */
  getProjet(idProjet: number): Observable<{ CreateurId: number }> {
    return this.http.get<{ CreateurId: number }>(`${this.apiProjets}/${idProjet}`);
  }

  /** 3) Lista miembros asignados al proyecto */
  getPersonnelProjet(idProjet: number): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(`${this.apiProjetsPersonnel}/${idProjet}`);
  }

  /** 4) Añade un miembro al proyecto */
  ajouterPersonneAuProjet(idProjet: number, idPersonnel: number): Observable<void> {
    return this.http.post<void>(
      this.apiProjetsPersonnel,
      { IdProjet: idProjet, IdPersonnel: idPersonnel }
    );
  }

  /** 5) Elimina un miembro del proyecto */
  supprimerPersonneDuProjet(idProjet: number, idPersonnel: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiProjetsPersonnel}/${idProjet}/${idPersonnel}`
    );
  }
}
