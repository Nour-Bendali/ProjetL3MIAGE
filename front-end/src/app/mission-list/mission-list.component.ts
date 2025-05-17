import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { MissionService, Mission } from '../services/mission.service';

// VOIR CETTE PAGE SUR LE SITE http://localhost:4200/projets/1/missions

@Component({
  selector: 'app-mission-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnInit {
  @Input() projectId: number | null = null;
  @Output() missionCree = new EventEmitter<void>();
  @Output() missionsUpdated = new EventEmitter<Mission[]>();

  missions: Mission[] = [];
  errorMessage: string | null = null;

  constructor(
    private missionService: MissionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Si projectId n'est pas fourni en Input, on essaie de le récupérer de la route
    if (!this.projectId) {
      const id = this.route.snapshot?.paramMap.get('id');
      if (id) {
        this.projectId = Number(id);
      } else {
        this.errorMessage = 'ID du projet manquant. Veuillez accéder à cette page via un projet valide.';
        return;
      }
    }
    this.loadMissions();
  }

  loadMissions(): void {
    if (!this.projectId) {
      this.errorMessage = 'ID du projet non défini.';
      return;
    }

    this.missionService.getMissionsByProjet(this.projectId)
      .pipe(take(1))
      .subscribe({
        next: (data: Mission[]) => {
          this.missions = data;
          this.missionsUpdated.emit(data); // Émet les missions mises à jour vers le composant parent
          console.log('✅ Missions chargées', this.missions);
        },
        error: (error: Error) => {
          console.error('❌ Erreur lors du chargement des missions', error);
          this.errorMessage = 'Impossible de charger les missions. Veuillez réessayer plus tard.';
        }
      });
  }

  // Méthode pour émettre l'événement de création de mission
  onMissionCreated(): void {
    this.missionCree.emit();
    this.loadMissions(); // Recharger la liste des missions
  }

  // Méthode publique pour rafraîchir les missions depuis le composant parent
  refreshMissions(): void {
    this.loadMissions();
  }

  deleteMission(id: number): void {
    if (!this.projectId) return;
  
    const confirmDelete = confirm('Supprimer cette mission ?');
    if (confirmDelete) {
      this.missionService.deleteMission(this.projectId, id)
        .subscribe({
          next: () => this.loadMissions(),
          error: (err) => console.error("Erreur de suppression :", err)
        });
    }
  }


}