import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CompetenceService } from '../services/competence.service';

@Component({
  selector: 'app-competences-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './competences-assign.component.html',
  styleUrls: ['./competences-assign.component.css']
})
export class CompetencesAssignComponent implements OnInit {
  missions: any[] = [];
  competences: any[] = [];
  selectedMissionId: number | null = null;
  selectedCompetenceId: string | null = null;

  constructor(private competenceService: CompetenceService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMissions();
    this.fetchCompetences();
  }

  fetchMissions(): void {
    this.http.get<any[]>('http://localhost:3000/api/missions').subscribe({
      next: (data) => this.missions = data,
      error: (err) => console.error('❌ Erreur lors du chargement des missions', err)
    });
  }

  fetchCompetences(): void {
    this.competenceService.getAllCompetences().subscribe({
      next: (data) => this.competences = data,
      error: (err) => console.error('❌ Erreur lors du chargement des compétences', err)
    });
  }

  assignCompetence(): void {
    if (!this.selectedMissionId || !this.selectedCompetenceId) {
      alert('Veuillez sélectionner une mission et une compétence.');
      return;
    }

    this.competenceService.assignCompetenceToMission(this.selectedMissionId, this.selectedCompetenceId).subscribe({
      next: () => alert('✅ Compétence assignée avec succès.'),
      error: (err) => {
        if (err.status === 409) {
          alert('⚠️ Cette compétence est déjà assignée à cette mission.');
        } else {
          alert('❌ Erreur lors de l’affectation de la compétence.');
          console.error(err);
        }
      }
    });
  }
}
