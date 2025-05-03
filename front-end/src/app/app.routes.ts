// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardProjectsComponent } from './dashboard-projects/dashboard-projects.component';
import { DashboardFoldersComponent } from './dashboard-folders/dashboard-folders.component';
import { RegisterComponent } from './register/register.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProjetComponent } from './projet/projet.component';
import { ProjetFormComponent } from './projet-form/projet-form.component';
import { MissionFormComponent } from './mission-form/mission-form.component';

export const routes: Routes = [
  // ✅ Redirige la racine vers '/login' (point d'entrée par défaut)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Routes principales
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard-projects', component: DashboardProjectsComponent },
  { path: 'dashboard-folders', component: DashboardFoldersComponent },
  { path: 'personnel', component: PersonnelComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // ✅ Routes pour les projets
  { path: 'projet/:id', component: ProjetComponent }, // Vue principale d’un projet
  { path: 'projet-form/:id', component: ProjetFormComponent }, // Formulaire pour gérer les membres
  { path: 'projets/:id/personnel', component: PersonnelComponent }, // Gestion du personnel pour un projet


  {path: 'mission-form', component: MissionFormComponent},
  // 📋 Route catch-all pour rediriger vers login si chemin inconnu
  { path: '**', redirectTo: 'login' }
];