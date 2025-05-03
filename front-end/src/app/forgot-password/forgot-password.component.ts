import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true, // ✅ Composant autonome
  imports: [FormsModule, CommonModule], // ✅ Import des modules nécessaires
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  username: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Cette méthode est appelée lors de la soumission du formulaire.
   * Elle envoie le nom d'utilisateur (ou email) au backend pour vérification.
   */
  verifyUser() {
    this.http.post('http://localhost:3000/api/verify-user', { username: this.username })
      .subscribe({
        next: () => {
          this.router.navigate(['/reset-password'], {
            state: { username: this.username }
          });
        },
        error: () => {
          this.errorMessage = 'Utilisateur non trouvé.';
        }
      });
  }
}
