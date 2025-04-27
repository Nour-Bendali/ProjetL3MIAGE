import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-projects',
  standalone: true,
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.css'],
  imports: [CommonModule, RouterLink] // CommonModule requerido por *ngFor
})
export class DashboardProjectsComponent {
  projects = [
    { id: 1, name: 'Projet 1', description: 'Description du projet 1' },
    { id: 2, name: 'Projet 2', description: 'Description du projet 2' }
  ]; // Liste statique pour l’instant
}
