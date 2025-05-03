import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true, // ✅ Composant autonome
  imports: [FormsModule, CommonModule], // ✅ Import des modules nécessaires
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  username: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {
    // 🔐 Récupération du nom d'utilisateur depuis la navigation
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['username']) {
      this.username = nav.extras.state['username'];
    } else {
      this.router.navigate(['/login']); // 🔄 Redirection si accès direct sans vérification
    }
  }

  /**
   * 🔁 Envoie la nouvelle password au backend pour mise à jour
   */
  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.http.post('http://localhost:3000/api/reset-password', {
      username: this.username,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.successMessage = "Mot de passe modifié avec succès.";
        setTimeout(() => this.router.navigate(['/']), 2000); // ⏳ Retour au login
      },
      error: () => {
        this.errorMessage = "Erreur lors de la modification du mot de passe.";
      }
    });
  }
}
