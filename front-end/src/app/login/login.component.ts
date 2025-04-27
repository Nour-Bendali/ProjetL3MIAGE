import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // 👈 Ajout de RouterLink pour la navigation
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule, RouterLink], // 👈 Importation des modules nécessaires
})
export class LoginComponent {
  // Champs liés au formulaire de connexion
  email: string = '';
  password: string = '';

  // Injection des services nécessaires : AuthService pour l'authentification et Router pour la navigation
  constructor(private authService: AuthService, private router: Router) {}

  // Méthode appelée lors de la soumission du formulaire
  onSubmit() {
    // Appel du service d'authentification avec les identifiants fournis
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Si la réponse est positive, redirection vers le tableau de bord
        if (response.success) {
          this.router.navigate(['/dashboard-projects']);
        } else {
          // Sinon, alerte utilisateur
          alert('Identifiants incorrects');
        }
      },
      (error) => {
        console.error(error);
  
        // Gestion personnalisée de l'erreur 400 (ex : champs vides)
        if (error.status === 400) {
          alert(error.error?.error || 'Email et mot de passe obligatoires.');
        } else {
          // Pour toute autre erreur serveur
          alert('Erreur du serveur');
        }
      }
    );
  }
}
