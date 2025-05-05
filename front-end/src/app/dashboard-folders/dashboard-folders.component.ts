import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-folders',
  standalone: true,
  templateUrl:'./dashboard-folders.component.html',
  styleUrls: ['./dashboard-folders.component.css'],
  imports: [CommonModule, RouterLink] // CommonModule requerido por *ngFor
})
export class DashboardFoldersComponent {
  folders = [
    { id: 1, name: 'Dossier 1', description: 'Description du dossier 1' },
    { id: 2, name: 'Dossier 2', description: 'Description du dossier 2' }
  ]; // Liste statique pour l’instant
}
