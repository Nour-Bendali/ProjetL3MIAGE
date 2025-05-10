// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  User: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    console.log('Formulaire soumis', { email: this.User, password: this.password });

    // 📡 Appel API pour la connexion
    this.http.post('http://localhost:3000/api/login', { User: this.User, password: this.password })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Connexion réussie');
            this.router.navigate(['/dashboard-folders']); // 📋 Redirection vers /dashboard-projects
          } else {
            console.log('Identifiants incorrects');
            this.errorMessage = 'Nom d\'Utilisateur ou mot de passe incorrect.';
          }
        },
        error: (error) => {
          console.error('Erreur lors de la connexion', error);
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      });
  }
}