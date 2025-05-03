import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardProjectsService } from './dashboard-projects.service';

@Component({
  selector: 'app-dashboard-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-projects.component.html',
  styleUrls: ['./dashboard-projects.component.css']
})
export class DashboardProjectsComponent implements OnInit {
  nouveauProjet = { nomProjet: '', description: '', createurId: 1 }; // à remplacer plus tard
  projets: any[] = [];

  constructor(private dashboardProjectsService: DashboardProjectsService) {}

  ngOnInit(): void {
    this.loadProjets();
  }

  loadProjets(): void {
    this.dashboardProjectsService.getAllProjet().subscribe({
      next: (data: any) => {
        this.projets = data;
      },
      error: (error: any) => console.error('❌ Erreur lors du chargement des projets', error)
    });
  }

  createProjet(): void {
    this.dashboardProjectsService.createProjet(this.nouveauProjet).subscribe({
      next: (response) => {
        console.log('✅ Projet créé avec succès', response);
        this.nouveauProjet.nomProjet = '';
        this.nouveauProjet.description = '';
        this.loadProjets(); // recharge la liste
      },
      error: (error) => console.error('❌ Erreur lors de la création', error)
    });
  }
}
