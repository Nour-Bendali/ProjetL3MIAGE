import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardProjectsComponent } from './dashboard-projects/dashboard-projects.component';
import { DashboardFoldersComponent } from './dashboard-folders/dashboard-folders.component';
import { RegisterComponent } from './register/register.component';
import { PersonnelComponent } from './personnel/personnel.component';
import { ProjetDetailComponent } from './projet-detail/projet-detail.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const routes: Routes = [
  // ✅ Redirige la raíz hacia '/login'
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Ruta explícita para la page de connexion
  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'dashboard-projects', component: DashboardProjectsComponent },

  { path: 'dashboard-folders', component: DashboardFoldersComponent },

  { path: 'personnel', component: PersonnelComponent },

  { path: 'projets/:id/personnel', component: PersonnelComponent },

  { path: 'projets/:id', component: ProjetDetailComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'reset-password', component: ResetPasswordComponent },


];
