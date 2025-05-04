import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-projets-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './projets-assign.component.html',
  styleUrls: ['./projets-assign.component.css']
})
export class ProjetsAssignComponent implements OnInit {
  projets: any[] = [];
  personnel: any[] = [];
  selectedProjetId: number | null = null;
  selectedPersonnelId: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProjets();
    this.fetchPersonnel();
  }

  fetchProjets(): void {
    this.http.get<any>('http://localhost:3000/api/projets').subscribe({
      next: (data) => {
        this.projets = data.projets ?? []; // ✅ corrige le problème NG0900
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des projets', err);
        alert('Erreur lors du chargement des projets.');
      }
    });
  }

  fetchPersonnel(): void {
    this.http.get<any>('http://localhost:3000/api/personnel').subscribe({
      next: (data) => {
        // Si la réponse est un tableau direct
        this.personnel = Array.isArray(data) ? data : (data.personnel ?? []);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement du personnel', err);
        alert('Erreur lors du chargement du personnel.');
      }
    });
  }

  assignPersonnel(): void {
    if (!this.selectedProjetId || !this.selectedPersonnelId) {
      alert('Veuillez sélectionner un projet et un membre du personnel.');
      return;
    }

    this.http.post(`http://localhost:3000/api/projets/${this.selectedProjetId}/personnel`, {
      idPersonnel: this.selectedPersonnelId
    }).subscribe({
      next: () => alert('✅ Membre assigné au projet avec succès.'),
      error: (err) => {
        if (err.status === 409) {
          alert('⚠️ Ce membre est déjà assigné à ce projet.');
        } else {
          alert('❌ Erreur lors de l’assignation.');
          console.error(err);
        }
      }
    });
  }
}
