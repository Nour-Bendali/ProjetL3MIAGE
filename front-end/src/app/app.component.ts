// src/app/app.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 📋 Pour les directives comme *ngIf
import { DashboardProjectsComponent } from './dashboard-projects/dashboard-projects.component';

// 🌟 Composant racine de l'application
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardProjectsComponent], // 📋 Importe DashboardProjectsComponent
  template: `
    <div>
      <h1>Application RecruitMIAGE</h1>
      <app-dashboard-projects></app-dashboard-projects>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'recruit-miage';
}