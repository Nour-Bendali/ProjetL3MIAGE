import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjetService } from '../services/projet.service';

@Component({
  selector: 'app-dashboard-folders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-folders.component.html',
  styleUrls: ['./dashboard-folders.component.css']
})
export class DashboardFoldersComponent implements OnInit {
  projets: any[] = [];

  constructor(private projetService: ProjetService) {}

  ngOnInit(): void {
    this.projetService.getAllProjets().subscribe({
      next: (data) => {
        this.projets = data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des projets :", err);
      }
    });
  }
}
