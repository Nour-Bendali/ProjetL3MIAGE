// Imports
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Permet de naviguer vers d'autres pages
import { FormsModule } from '@angular/forms';           // Pour gérer les formulaires et ngModel
import { CommonModule } from '@angular/common';         // Pour les directives Angular de base
import { AuthService } from '../auth.service';          // Service pour appeler les méthodes d’authentification

// Afficher un champ pour saisir son nom d’utilisateur
// et déclenche la vérification côté backend.
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

  /**
   * Services :
   * - authService pour appeler l’API
   * - router pour naviguer vers la page de réinitialisation
   */

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * 1. Vide les anciens messages d’erreur
   * 2. Vérifie que le champ n’est pas vide
   * 3. Active le spinner et appelle le service de vérification
   * 4. Si l’utilisateur existe, on navigue vers reset-password
   * 5. Sinon, on affiche l'erreur en question
   */

  verifyUser(): void {
    this.errorMessage = '';

    if (!this.username.trim()) {
      this.errorMessage = 'Veuillez saisir votre nom d\'utilisateur.';
      return;
    }

    this.isLoading = true;

    this.authService.verifyUser(this.username).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(
            ['/reset-password'],
            { queryParams: { username: this.username } }
          );
        } else {
          this.errorMessage = 'Utilisateur non reconnu.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la vérification.';
      }
    });
  }
}
