// src/main.ts
// import { HttpClientModule } from '@angular/common/http';  // ⛔️ À supprimer
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';

// Correction : suppression du décorateur @Component car il n'est pas à sa place ici
// Correction : ajout des imports manquants pour CommonModule, RouterModule et FormsModule

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()) // 📋 Active l'API fetch pour HttpClient
  ]
})
  .catch(err => console.error(err));