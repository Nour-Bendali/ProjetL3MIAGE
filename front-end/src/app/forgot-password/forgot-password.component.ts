// src/app/forgot-password/forgot-password.component.ts

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterModule ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  username: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  verifyUser(): void {
    this.errorMessage = '';
    if (!this.username.trim()) {
      this.errorMessage = 'Veuillez saisir votre nom d\'utilisateur.';
      return;
    }
    this.isLoading = true;
    this.authService.verifyUser(this.username)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/reset-password'], { state: { username: this.username } });
        },
        error: (err: any) => {
          this.isLoading = false;
          if (err.status === 404) {
            this.errorMessage = 'Utilisateur non trouvé.';
          } else {
            console.error('❌ Erreur verify-user:', err);
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          }
        }
      });
  }
}
