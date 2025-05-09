import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardProjectsComponent } from './dashboard-projects/dashboard-projects.component';
import { DashboardFoldersComponent } from './dashboard-folders/dashboard-folders.component';
import { RegisterComponent } from './register/register.component';

// Définition des routes de l'application
export const routes: Routes = [
  // Route par défaut : redirige vers le composant de connexion
  { path: '', component: LoginComponent },

  // Route pour accéder à la page d'inscription
  { path: 'register', component: RegisterComponent },

  // Route vers le tableau de bord des projets
  { path: 'dashboard-projects', component: DashboardProjectsComponent },

  // Route vers le tableau de bord des dossiers
  { path: 'dashboard-folders', component: DashboardFoldersComponent }
];
