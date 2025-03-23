import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    // Rutas de la aplicación
    provideRouter(routes),
    // HttpClient (opcional, si vas a hacer peticiones HTTP)
    provideHttpClient(),
    // Animaciones (opcional, si usarás Angular Material u otras animaciones)
    provideAnimations(),
    // Si prefieres importar FormsModule globalmente, podrías hacer:
    // importProvidersFrom(FormsModule),
    // Pero en este ejemplo lo haremos directamente dentro de login.component.ts
  ],
};
