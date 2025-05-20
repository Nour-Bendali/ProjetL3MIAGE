// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  success: boolean;
  token:   string;
}

interface VerifyResponse {
  success: boolean;
}

interface ResetResponse {
  success: boolean;
  error?:  string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl    = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'jwt_token';

  constructor(private http: HttpClient) {}

  /** 🔒 Connexion */
  login(user: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      { User: user, password }
    );
  }

  /** 🔍 Vérifie qu’un utilisateur existe avant reset */
  verifyUser(username: string): Observable<VerifyResponse> {
    return this.http.post<VerifyResponse>(
      `${this.baseUrl}/verify-user`,
      { username }
    );
  }

  /** 🔑 Réinitialise le mot de passe */
  resetPassword(username: string, newPassword: string): Observable<ResetResponse> {
    return this.http.post<ResetResponse>(
      `${this.baseUrl}/reset-password`,
      { username, newPassword }
    );
  }

  /** 📥 Récupère le JWT du localStorage */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** 📤 Stocke le JWT dans localStorage */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /** ❌ Supprime le JWT (logout) */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
