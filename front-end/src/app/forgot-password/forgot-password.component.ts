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
    this.authService.verifyUser(this.username).subscribe({
      next: (response) => {
        if (response.success) {
          // Stocker temporairement le username
          this.router.navigate(['/reset-password'], { queryParams: { username: this.username } });
        } else {
          this.errorMessage = "Utilisateur non reconnu.";
        }
      },
      error: () => {
        this.errorMessage = "Erreur lors de la vérification.";
      }
    });
  }
}
