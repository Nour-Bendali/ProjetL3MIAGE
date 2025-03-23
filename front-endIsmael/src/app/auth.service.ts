import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // URL de l'API pour la connexion
  private loginUrl = 'http://localhost:3000/api/login';

  // Injection du service HttpClient pour effectuer des requêtes HTTP
  constructor(private http: HttpClient) {}

  /**
   * Envoie une requête POST au serveur pour tenter une connexion avec les identifiants fournis.
   * @param email L'adresse email de l'utilisateur
   * @param password Le mot de passe de l'utilisateur
   * @returns Un Observable contenant un objet avec une propriété "success" (true/false)
   */
  login(email: string, password: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(this.loginUrl, { email, password });
  }
}
