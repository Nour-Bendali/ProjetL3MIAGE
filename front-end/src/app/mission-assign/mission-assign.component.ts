// src/app/mission-assign/mission-assign.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
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

  personnel: Membre[] = [];            // Lista de miembros para el dropdown
  selectedPersonnelId?: number;        // ID del miembro seleccionado
  errorMessage: string | null = null;  // Mensaje de error
  isLoading = false;
  @Output() missionAssigned = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    // Cargar miembros del proyecto
    this.http.get<Membre[]>(
      `http://localhost:3000/api/projets-personnel/${this.projectId}`,
      { headers }
    ).subscribe({
      next: data => this.personnel = data,
      error: err => {
        console.error('❌ Erreur chargement membres:', err);
        this.errorMessage = 'Impossible de charger les membres.';
      }
    });
  }

  assignMission(): void {
    if (!this.selectedPersonnelId) return;
    this.isLoading = true;

    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    this.http.post(
      `http://localhost:3000/api/missions-personnel/${this.selectedMissionId}/assign`,
      { idPersonnel: this.selectedPersonnelId },
      { headers }
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.errorMessage = null;
        this.missionAssigned.emit();
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
