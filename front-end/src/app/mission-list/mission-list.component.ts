import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

// VOIR CETTE PAGE SUR LE SITE http://localhost:4200/projets/1/missions
@Component({
  selector: 'app-mission-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnInit {
  missions: any[] = [];
  projectId: number | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Vérifier si la route contient un paramètre 'id'
    const id = this.route.snapshot?.paramMap.get('id');
    if (id) {
      this.projectId = Number(id);
      this.loadMissions();
    } else {
      this.errorMessage = 'ID du projet manquant. Veuillez accéder à cette page via un projet valide.';
    }
  }

  loadMissions(): void {
    if (!this.projectId) {
      this.errorMessage = 'ID du projet non défini.';
      return;
    }
    this.http.get(`http://localhost:3000/api/projets/${this.projectId}/missions`)
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          this.missions = data;
          console.log('✅ Missions chargées', this.missions);
        },
        error: (error) => {
          console.error('❌ Erreur lors du chargement des missions', error);
          this.errorMessage = 'Impossible de charger les missions. Veuillez réessayer plus tard.';
        }
      });
  }
}