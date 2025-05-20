import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Membre } from '../services/mission.service';

@Component({
  selector: 'app-mission-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './mission-assign.component.html',
  styleUrls: ['./mission-assign.component.css']
})
export class MissionAssignComponent implements OnInit {
  @Input() selectedMissionId!: number;
  @Input() projectId!: number;
  @Output() missionAssigned = new EventEmitter<void>();

  personnel: Membre[] = [];
  selectedPersonnelId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProjectPersonnel();
  }

  private loadProjectPersonnel(): void {
    if (!this.projectId) {
      this.errorMessage = 'ID du projet non défini';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // APPPEL CORRIGÉ : GET /api/projets-personnel/:id/personnel
    this.http
      .get<Membre[]>(
        `http://localhost:3000/api/projets-personnel/${this.projectId}/`
      )
      .subscribe({
        next: data => {
          this.personnel = data;
          this.errorMessage = null;  // même si tableau vide
          this.isLoading = false;
        },
        error: err => {
          console.error('❌ Erreur chargement membres:', err);
          this.errorMessage = 'Impossible de charger les membres du projet';
          this.personnel = [];
          this.isLoading = false;
        }
      });
  }

  assignMission(): void {
    if (!this.selectedMissionId || !this.selectedPersonnelId) {
      this.errorMessage = 'Veuillez sélectionner un membre';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // APPEL CORRIGÉ : POST /api/missions/:id/assign
    this.http
      .post<{ success: boolean }>(
        `http://localhost:3000/api/missions-personnel/${this.selectedMissionId}/assign`,
        { idPersonnel: this.selectedPersonnelId }
      )
      .subscribe({
        next: () => {
          console.log('✅ Mission assignée avec succès');
          this.selectedPersonnelId = null;
          this.missionAssigned.emit();
          this.isLoading = false;
        },
        error: err => {
          this.isLoading = false;
          if (err.status === 409) {
            this.errorMessage = 'Ce membre est déjà assigné à cette mission';
          } else {
            console.error('❌ Erreur assignation mission:', err);
            this.errorMessage = 'Erreur lors de l’assignation de la mission';
          }
        }
      });
  }
}
