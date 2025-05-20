// src/app/reset-password/reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  username: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔐 Récupère le nom d'utilisateur depuis history.state
    this.username = history.state.username || '';
    if (!this.username) {
      // Pas de username => retour au login
      this.router.navigate(['/login']);
    }
  }

  /**
   * 🔁 Envoie la nouvelle password au backend pour mise à jour
   */
  resetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword(this.username, this.newPassword)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.successMessage = 'Mot de passe modifié avec succès.';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          } else {
            this.errorMessage = res.error || 'Erreur lors de la modification du mot de passe.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('❌ Erreur reset-password:', err);
          this.errorMessage = err.error?.error || 'Erreur lors de la modification du mot de passe.';
        }
      });
  }
}
