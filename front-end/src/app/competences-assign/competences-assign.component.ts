// src/app/competences-assign/competences-assign.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { FormsModule }     from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http'; // Added HttpClient & HttpHeaders
import { AuthService }     from '../auth.service';                              // Added AuthService

interface CompetenceOption {
  IdentifiantC: string;
  Competence:   string;
}

@Component({
  selector: 'app-competences-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './competences-assign.component.html',
  styleUrls: ['./competences-assign.component.css']
})
export class CompetencesAssignComponent implements OnInit {
  @Input() missionId!: number;                        
  @Output() competenceAssigned = new EventEmitter<void>();

  competences: CompetenceOption[] = [];  // liste des compétences dispo
  selectedCompetenceId: string | null = null; 
  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private http: HttpClient,               // Added
    private authService: AuthService        // Added
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();                                        // Added
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    // Charger toutes les compétences
    this.http.get<CompetenceOption[]>('http://localhost:3000/api/competences', { headers })
      .subscribe({
        next: data => this.competences = data,
        error: err => {
          console.error('❌ Erreur chargement compétences :', err);
          this.errorMessage = 'Impossible de charger les compétences.';
        }
      });
  }

  assignCompetence(): void {
    if (!this.selectedCompetenceId) return;
    this.isLoading = true;
    const token = this.authService.getToken();                                        // Added
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);         // Added

    this.http.post(
      `http://localhost:3000/api/competences-missions/${this.missionId}/competences`, 
      { idCompetence: this.selectedCompetenceId },
      { headers }
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.errorMessage = null;
        this.selectedCompetenceId = null;
        this.competenceAssigned.emit();  // notifie le parent pour rafraîchir
      },
      error: err => {
        this.isLoading = false;
        if (err.status === 409) {
          alert('⚠️ Cette compétence est déjà assignée.');
        } else {
          console.error('❌ Erreur lors de l’affectation :', err);
          this.errorMessage = 'Erreur lors de l’affectation.';
        }
      }
    });
  }
}
