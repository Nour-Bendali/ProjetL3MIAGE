import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjetsFormService } from './projets-form.service';

@Component({
  selector: 'app-projets-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './projets-form.component.html',
  styleUrls: ['./projets-form.component.css']
})
export class ProjetsFormComponent implements OnInit {
  nouveauProjet = { nomProjet: '', description: '', createurId: 1 };
  projets: any[] = [];

  constructor(private projetsFormService: ProjetsFormService) {}

  ngOnInit(): void {
    this.loadProjets();
  }

  loadProjets(): void {
    this.projetsFormService.getAllProjet().subscribe({
      next: (data: any) => {
        this.projets = data;
      },
      error: (error: any) => console.error('❌ Erreur lors du chargement des projets', error)
    });
  }

  createProjet(): void {
    this.projetsFormService.createProjet(this.nouveauProjet).subscribe({
      next: (response: any) => {
        alert('✅ Projet créé avec succès !');
        console.log('✅ Projet créé avec succès', response);
        this.nouveauProjet.nomProjet = '';
        this.nouveauProjet.description = '';
        this.loadProjets();
      },
      error: (error: any) => {
        alert('❌ Erreur lors de la création du projet.');
        console.error('❌ Erreur lors de la création', error);
      }
    });
  }
}
