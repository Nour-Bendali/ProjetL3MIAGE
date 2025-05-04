// src/app/projet-form/projet-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-projet-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projet-form.component.html',
  styleUrls: ['./projet-form.component.css']
})
export class ProjetFormComponent implements OnInit {
  projectId: number | null = null;
  personnelList: any[] = [];
  selectedPersonnelId: number | null = null;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPersonnel();
  }

  loadPersonnel(): void {
    this.http.get('http://localhost:3000/api/personnel').subscribe({
      next: (data: any) => {
        this.personnelList = data;
        console.log('✅ Liste des membres chargée', this.personnelList);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des membres', error);
      }
    });
  }

  addMember(): void {
    if (this.selectedPersonnelId && this.projectId) {
      this.http.post(`http://localhost:3000/api/projets/${this.projectId}/personnel`, { idPersonnel: this.selectedPersonnelId }).subscribe({
        next: () => {
          this.message = 'Membre ajouté avec succès.';
          this.selectedPersonnelId = null;
          this.goBack(); // Retour à la page projet après ajout
        },
        error: (error) => {
          console.error('❌ Erreur lors de l’ajout du membre', error);
          this.message = 'Erreur lors de l’ajout.';
        }
      });
    }
  }

  deleteMember(idPersonnel: number): void {
    if (this.projectId && confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      this.http.delete(`http://localhost:3000/api/projets/${this.projectId}/personnel/${idPersonnel}`).subscribe({
        next: () => {
          this.message = 'Membre supprimé avec succès.';
          this.goBack(); // Retour à la page projet après suppression
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression du membre', error);
          this.message = 'Erreur lors de la suppression.';
        }
      });
    }
  }

  goBack(): void {
    if (this.projectId) {
      this.router.navigate([`/projet/${this.projectId}`]);
    }
  }
}