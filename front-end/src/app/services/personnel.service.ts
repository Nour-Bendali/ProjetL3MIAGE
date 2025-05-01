import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiUrl = 'http://localhost:3000/api/personnel';

  constructor(private http: HttpClient) { }

  getAllPersonnel(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createPersonnel(personnel: any): Observable<any> {
    return this.http.post(this.apiUrl, personnel);
  }

  deletePersonnel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 