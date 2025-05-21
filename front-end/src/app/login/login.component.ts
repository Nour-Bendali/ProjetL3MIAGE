// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {AuthService} from '../auth.service'

interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  User = '';            // champ utilisateur
  password = '';        // champ mot de passe
  errorMessage = '';    // message d'erreur affiché dans le template

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    // reset du message à chaque tentative
    this.errorMessage = '';

    this.http
      .post<LoginResponse>(
        'http://localhost:3000/api/auth/login',
        { User: this.User, password: this.password }
      )
      .subscribe({
        next: res => {
          if (res.success && res.token) {
            // stocker le JWT
            localStorage.setItem('jwt_token', res.token);
            this.authService.setToken(res.token);

            // redirection
            this.router.navigate(['/dashboard-folders']);
          } else {
            // cas où backend renvoie { success: false, error: '...' }
            this.errorMessage = res.error || 'Utilisateur ou mot de passe invalide.';
          }
        },
        error: err => {
          console.error('Erreur lors de la connexion', err);
          // si 401 Unauthorized, afficher message d'identifiants invalides
          if (err.status === 401) {
            this.errorMessage = 'Utilisateur ou mot de passe invalide.';
          } else {
            // autre erreur (réseau, serveur, etc.)
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          }
        }
      });
  }
}
