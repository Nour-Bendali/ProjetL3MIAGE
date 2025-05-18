import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CompetenceService } from '../services/competence.service';

@Component({
  selector: 'app-competences-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './competences-assign.component.html',
  styleUrls: ['./competences-assign.component.css']
})
export class CompetencesAssignComponent implements OnInit {
  @Input() missionId!: number; // ✅ correction
  @Output() competenceAssigned = new EventEmitter<void>(); // ✅ pour rafraîchir après ajout

  competences: any[] = [];
  selectedCompetenceId: string | null = null;

  isLoading = false;
  errorMessage = '';

  constructor(private competenceService: CompetenceService) {}

  ngOnInit(): void {
    this.fetchCompetences();
  }

  fetchCompetences(): void {
    this.competenceService.getAllCompetences().subscribe({
      next: (data) => this.competences = data,
      error: (err) => {
        this.errorMessage = '❌ Erreur lors du chargement des compétences';
        console.error(err);
      }
    });
  }

  assignCompetence(): void {
    if (!this.missionId || !this.selectedCompetenceId) {
      alert('Veuillez sélectionner une compétence.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.competenceService.assignCompetenceToMission(this.missionId, this.selectedCompetenceId).subscribe({
      next: () => {
        this.isLoading = false;
        this.selectedCompetenceId = null;
        this.competenceAssigned.emit(); // ✅ notifie le parent
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          alert('⚠️ Cette compétence est déjà assignée.');
        } else {
          this.errorMessage = 'Erreur lors de l’affectation.';
          console.error(err);
        }
      }
    });
  }
}
