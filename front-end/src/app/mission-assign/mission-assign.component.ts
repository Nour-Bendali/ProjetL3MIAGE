import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProjectPersonnel();
    console.log('🧪 projectId reçu dans input =', this.projectId, typeof this.projectId);

  }

  loadProjectPersonnel(): void {
    if (!this.projectId) {
      this.errorMessage = 'ID du projet non défini';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.http.get<Membre[]>(`http://localhost:3000/api/projets-personnels/${this.projectId}`)
      .subscribe({
        next: (data) => {
          this.personnel = data;
          this.errorMessage = null; // ✅ même si la liste est vide, pas une erreur
          this.isLoading = false;
          console.log('✅ Membres du projet chargés:', data);
        },
        error: (err) => {
          console.error(' Erreur lors du chargement des membres:', err);
          this.errorMessage = 'Impossible de charger les membres du projet';
          this.isLoading = false;
          this.personnel = [];
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

    this.http.post(`http://localhost:3000/api/missions/${this.selectedMissionId}/assign`, {
      idPersonnel: this.selectedPersonnelId
    }).subscribe({
      next: () => {
        this.selectedPersonnelId = null;
        this.missionAssigned.emit();
        this.isLoading = false;
        console.log('Mission assignée avec succès');
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = 'Ce membre est déjà assigné à cette mission';
        } else {
          this.errorMessage = 'Erreur lors de l\'assignation de la mission';
          console.error('Erreur détaillée:', err);
        }
      }
    });
  }
}
