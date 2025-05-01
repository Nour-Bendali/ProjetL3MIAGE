// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http'; // 📋 Ajout de withFetch
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()) // 📋 Active l'API fetch pour HttpClient
  ]
})
  .catch(err => console.error(err));