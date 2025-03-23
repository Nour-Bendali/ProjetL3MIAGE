import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  // Sélecteur principal de l'application (utilisé dans index.html)
  selector: 'app-root',

  // Composant autonome, sans dépendance à un module Angular classique
  standalone: true,

  // Importation de RouterOutlet pour gérer l'affichage des routes enfants
  imports: [RouterOutlet],

  // Template principal qui agit comme point d'entrée pour le routage
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  // Ce composant ne contient pas de logique spécifique, 
  // il sert uniquement de conteneur aux autres vues via le système de routage.
}
