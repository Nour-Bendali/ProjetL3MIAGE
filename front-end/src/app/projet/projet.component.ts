// src/app/projet/projet.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetService } from '../services/projet.service'; // à créer si besoin

@Component({
  selector: 'app-projet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {
  projets: any[] = [];

  constructor(private projetService: ProjetService) {}

  ngOnInit(): void {
    this.chargerProjets();
  }

  chargerProjets(): void {
    this.projetService.getAllProjets().subscribe({
      next: (data) => {
        this.projets = data;
        console.log("✅ Projets chargés", this.projets);
      },
      error: (err) => {
        console.error("❌ Erreur lors du chargement des projets", err);
      }
    });
  }
}
