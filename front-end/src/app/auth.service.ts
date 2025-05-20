// src/app/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Added: Inject PLATFORM_ID
import { isPlatformBrowser } from '@angular/common';            // Added: import isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  success: boolean;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // URL de l'API pour la connexion
  private loginUrl = 'http://localhost:3000/api/auth/login';
  private readonly TOKEN_KEY = 'jwt_token'; // key for storing JWT in localStorage
  private isBrowser: boolean;              // Added: flag to check browser context

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Added: inject platformId
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Added: determine if running in browser
  }

  /**
   * Envoie une requête POST au serveur pour tenter une connexion avec les identifiants fournis.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { email, password }).pipe(
      tap(res => {
        if (this.isBrowser) {                        // Added: guard localStorage
          localStorage.setItem(this.TOKEN_KEY, res.token); // store JWT in browser only
        }
      })
    );
  }

  /**
   * Récupère le token JWT stocké
   */
  getToken(): string | null {
    if (this.isBrowser) {                          // Added: guard localStorage
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Supprime le token JWT pour déconnexion
   */
  logout(): void {
    if (this.isBrowser) {                          // Added: guard localStorage
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
}
