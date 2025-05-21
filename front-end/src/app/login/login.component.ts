// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

// Interface pour structurer la réponse de l'API lors de la connexion
interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Composant qui gère la page de connexion de l'application.
 * Permet à l'utilisateur de se connecter avec un nom d'utilisateur et un mot de passe,
 * et redirige vers le tableau de bord en cas de succès.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Variables pour stocker les données du formulaire
  User = '';            // Nom d'utilisateur saisi
  password = '';        // Mot de passe saisi
  errorMessage = '';    // Message d'erreur affiché en cas d'échec

  // Injection des dépendances pour les requêtes HTTP, la navigation et l'authentification
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  /**
   * Méthode appelée lors de la soumission du formulaire de connexion.
   * Envoie une requête HTTP à l'API pour vérifier les identifiants,
   * stocke le token JWT en cas de succès, et redirige vers le tableau de bord.
   */
  onSubmit(): void {
    // Réinitialisation du message d'erreur à chaque tentative
    this.errorMessage = '';

    // Envoi de la requête de connexion à l'API
    this.http
      .post<LoginResponse>(
        'http://localhost:3000/api/auth/login',
        { User: this.User, password: this.password }
      )
      .subscribe({
        next: res => {
          if (res.success && res.token) {
            // Stockage du token JWT dans le localStorage et AuthService
            localStorage.setItem('jwt_token', res.token);
            this.authService.setToken(res.token);

            // Redirection vers le tableau de bord
            this.router.navigate(['/dashboard-folders']);
          } else {
            // Affichage d'un message d'erreur si l'authentification échoue
            this.errorMessage = res.error || 'Utilisateur ou mot de passe invalide.';
          }
        },
        error: err => {
          // Gestion des erreurs HTTP (ex: 401 Unauthorized)
          console.error('Erreur lors de la connexion', err);
          if (err.status === 401) {
            this.errorMessage = 'Utilisateur ou mot de passe invalide.';
          } else {
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          }
        }
      });
  }
}