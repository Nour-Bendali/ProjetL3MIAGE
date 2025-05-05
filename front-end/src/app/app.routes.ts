// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardFoldersComponent } from './dashboard-folders/dashboard-folders.component';
import { RegisterComponent } from './register/register.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProjetComponent } from './projet/projet.component';
import { ProjetsFormComponent } from './projets-form/projets-form.component';
import { ProjetsAssignComponent } from './projets-assign/projets-assign.component';
import { MissionFormComponent } from './mission-form/mission-form.component';
import { MissionListComponent } from './mission-list/mission-list.component';
export const routes: Routes = [
  // ✅ Redirige la racine vers '/login' (point d'entrée par défaut)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Routes principales
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'projets-form', component: ProjetsFormComponent },
  { path: 'projets-assign', component: ProjetsAssignComponent },
  { path: 'dashboard-folders', component: DashboardFoldersComponent },
  { path: 'personnel', component: PersonnelComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'mission-list', component: MissionListComponent},
  { path: 'projets/:id/missions', component: MissionListComponent },
  // ✅ Routes pour les projets
  { path: 'projet/:id', component: ProjetComponent }, // Vue principale d’un projet
  //{ path: 'projet-form/:id', component: ProjetsFormComponent }, // Formulaire pour gérer les membres
  { path: 'projets/:id/personnel', component: PersonnelComponent }, // Gestion du personnel pour un projet
  

  {path: 'mission-form', component: MissionFormComponent},
  // 📋 Route catch-all pour rediriger vers login si chemin inconnu
  { path: '**', redirectTo: 'login' }
];