// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; // Added: import tap operator

interface LoginResponse {
  success: boolean;
  token: string; // Added: include token in response interface
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // URL de l'API pour la connexion
  private loginUrl = 'http://localhost:3000/api/auth/login';
  private readonly TOKEN_KEY = 'jwt_token'; // Added: key for storing JWT in localStorage

  // Injection du service HttpClient pour effectuer des requêtes HTTP
  constructor(private http: HttpClient) {}

  /**
   * Envoie une requête POST au serveur pour tenter une connexion avec les identifiants fournis.
   * @param email L'adresse email de l'utilisateur
   * @param password Le mot de passe de l'utilisateur
   * @returns Un Observable contenant un objet avec une propriété "success" et le "token" JWT
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token); // Added: store JWT in localStorage
      })
    );
  }

  /**
   * Récupère le token JWT stocké
   * @returns Le token ou null si absent
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY); // Added: retrieve JWT from localStorage
  }

  /**
   * Supprime le token JWT pour déconnexion
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY); // Added: remove JWT from localStorage
  }
}
