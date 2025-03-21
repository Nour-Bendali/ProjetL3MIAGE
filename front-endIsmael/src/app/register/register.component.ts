import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private http: HttpClient) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }

    const userData = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/register', userData).subscribe({
      next: (response) => {
        console.log('Inscription réussie :', response);
        alert('Inscription réussie !');
        this.resetForm();
      },
      error: (err) => {
        console.error('Erreur lors de l’inscription :', err);
        alert('Erreur : ' + (err.error?.error || 'Problème serveur'));
      }
    });
  }

  resetForm() {
    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }
}