import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-mission-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mission-assign.component.html',
  styleUrls: ['./mission-assign.component.css']
})
export class MissionAssignComponent implements OnInit {
  missions: any[] = [];
  personnel: any[] = [];

  selectedMissionId: number | null = null;
  selectedPersonnelId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMissions();
  }

  fetchMissions(): void {
    this.http.get<any>('http://localhost:3000/api/missions').subscribe({
      next: (data) => this.missions = data,
      error: (err) => {
        console.error('❌ Erreur lors du chargement des missions', err);
        alert('Erreur lors du chargement des missions.');
      }
    });
  }

  onMissionChange(): void {
    if (!this.selectedMissionId) return;

    this.http.get<any>(`http://localhost:3000/api/missions/${this.selectedMissionId}/personnel`).subscribe({
      next: (data) => this.personnel = data.personnel ?? [],
      error: (err) => {
        console.error('❌ Erreur lors de la récupération du personnel lié à la mission', err);
        alert('Erreur lors du chargement des membres du projet.');
      }
    });
  }

  assignMission(): void {
    if (!this.selectedMissionId || !this.selectedPersonnelId) {
      alert('Veuillez sélectionner une mission et un membre du personnel.');
      return;
    }

    this.http.post(`http://localhost:3000/api/missions/${this.selectedMissionId}/assign`, {
      idPersonnel: this.selectedPersonnelId
    }).subscribe({
      next: () => {
        alert('✅ Mission assignée avec succès.');
        this.selectedPersonnelId = null;
      },
      error: (err) => {
        if (err.status === 409) {
          alert('⚠️ Ce membre a déjà cette mission.');
        } else {
          alert('❌ Erreur lors de l’affectation de la mission.');
          console.error(err);
        }
      }
    });
  }
}
