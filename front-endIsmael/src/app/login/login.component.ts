import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/login', loginData).subscribe({
      next: (response) => {
        console.log('Connexion réussie :', response);
        alert('Connexion réussie !');
        this.router.navigate(['/dashboard-projects']);
      },
      error: (err) => {
        console.error('Erreur lors de la connexion :', err);
        alert('Erreur : ' + (err.error?.error || 'Problème serveur'));
      }
    });
  }
}