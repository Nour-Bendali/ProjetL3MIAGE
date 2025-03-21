import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-projects',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.css']
})
export class DashboardProjectsComponent {
  projects = [
    { id: 1, name: 'Projet 1', description: 'Description du projet 1' },
    { id: 2, name: 'Projet 2', description: 'Description du projet 2' }
  ]; // Liste statique pour l’instant
}