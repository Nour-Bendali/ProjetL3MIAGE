import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mission-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnInit {
  missions: any[] = [];
  projectId: number = 1; // Temporaire, à remplacer par un ID dynamique via la route
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMissions();
  }

  loadMissions(): void {
    this.http.get(`http://localhost:3000/api/projets/${this.projectId}/missions`).subscribe({
      next: (data: any) => {
        this.missions = data;
        console.log('✅ Missions chargées', this.missions);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des missions', error);
        this.errorMessage = 'Impossible de charger les missions. Veuillez réessayer plus tard.';
      }
    });
  }
}