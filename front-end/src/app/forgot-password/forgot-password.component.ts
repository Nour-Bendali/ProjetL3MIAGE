import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';            // Added: RouterModule
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Added: HttpClientModule
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true, 
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,   // Added
    RouterModule        // Added
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  username: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Appel à l’API pour vérifier que l’utilisateur existe.
   */
  verifyUser() {
    this.errorMessage = ''; // Added: réinitialiser le message d'erreur
    this.http
      .post<{ success: boolean }>(
        'http://localhost:3000/api/auth/verify-user', // Updated: route correcte sous /api/auth
        { username: this.username }                    // body unchanged
      )
      .subscribe({
        next: () => {
          // Si trouvé, on redirige vers reset-password
          this.router.navigate(['/reset-password'], {
            state: { username: this.username }
          });
        },
        error: (err) => {
          console.error('❌ Erreur verify-user:', err); 
          this.errorMessage = 'Utilisateur non trouvé.'; // Updated message
        }
      });
  }
}
