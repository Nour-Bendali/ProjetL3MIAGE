import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    console.log('onSubmit disparado:', this.email, this.password);

    // Aquí deberías invocar tu AuthService y navegar:
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        if (response.success) {
          // Por ejemplo, redirigir a la página /home:
          this.router.navigate(['/home']);
        } else {
          alert('Credenciales incorrectas');
        }
      },
      (error) => {
        console.error(error);
        alert('Error en el servidor.');
      }
    );
  }
}
