import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardProjectsComponent } from './dashboard-projects/dashboard-projects.component';
import { DashboardFoldersComponent } from './dashboard-folders/dashboard-folders.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard-projects', component: DashboardProjectsComponent },
  { path: 'dashboard-folders', component: DashboardFoldersComponent }
];