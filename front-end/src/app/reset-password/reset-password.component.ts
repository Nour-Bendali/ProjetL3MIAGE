// Imports 
import { ActivatedRoute } from '@angular/router';       // Pour lire les paramètres dans l’URL 
import { Component, OnInit } from '@angular/core';      // Appeler le core
import { Router, RouterModule } from '@angular/router'; // Navigation Angular
import { FormsModule } from '@angular/forms';           // ngModel formulaires
import { CommonModule } from '@angular/common';         // fonctions Angular de base
import { AuthService } from '../auth.service';          // Service pour appeler l’API d’authentification

// Composant qui permet à l'utilisateur de réinitialiser son mot de passe.
@Component({
  selector: 'app-reset-password',
  standalone: true,                
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  //Stockage des valeurs
  newPassword: string = '';
  confirmPassword: string = '';   
  username: string = '';

  // Messages à afficher en cas d’erreur ou de succès
  errorMessage: string = '';
  successMessage: string = '';

  // Une fois la reponse validé bloque l'utilisateur
  isLoading: boolean = false;

  /**
   * Injection des services nécessaires :
   * - authService : pour communiquer avec l’API
   * - router      : pour rediriger l’utilisateur
   * - route       : pour lire les paramètres de l’URL
   */
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Au chargement du composant :
   * 1. On récupère le paramètre "username" dans l’URL
   * 2. Si absent, on renvoie l’utilisateur vers la page de login
   */

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || '';
      if (!this.username) {
        this.router.navigate(['/login']);
      }
    });
  }

  
  /**
   * 1. On réinitialise tous les messages
   * 2. Verification que les champs sont remplis et que tout match
   * 3. On active le spinner 'Isloading' et on envoie a node
   * 4. Si succès → message + redirection sinon erreur → affichage du message
   */

  resetPassword(): void {
    // On efface d’anciennes alertes
    this.errorMessage = '';
    this.successMessage = '';

    // Vérification basique des champs
    if (!this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    // Affichage du spinner
    this.isLoading = true;

    // Envoi de la requête au service d’authentification
    this.authService.resetPassword(this.username, this.newPassword)
      .subscribe({
        next: (res) => {
          this.isLoading = false;  // On arrête le spinner
          if (res.success) {
            this.successMessage = 'Mot de passe modifié avec succès.';
            // Après 2 secondes  on redirige vers la page de connexion
            setTimeout(() => this.router.navigate(['/login']), 2000);
          } else {
            // Si le backend renvoie un erreur
            this.errorMessage = res.error || 'Erreur lors de la modification du mot de passe.';
          }
        },
        error: (err) => {
          this.isLoading = false;  // On arrête aussi le spinner en cas d’erreur
          console.error('Erreur reset-password :', err);
          this.errorMessage = err.error?.error || 'Erreur lors de la modification du mot de passe.';
        }
      });
  }
}
