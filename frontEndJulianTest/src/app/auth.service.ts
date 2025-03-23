import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginUrl = 'http://localhost:3000/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(this.loginUrl, { email, password });
  }
}
