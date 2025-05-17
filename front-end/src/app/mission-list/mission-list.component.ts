import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { MissionService, Mission } from '../services/mission.service';
import { MissionAssignComponent } from '../mission-assign/mission-assign.component';

// VOIR CETTE PAGE SUR LE SITE http://localhost:4200/projets/1/missions

@Component({
  selector: 'app-mission-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MissionAssignComponent],
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnInit {
  @Input() projectId: number | undefined;
  @Output() missionCree = new EventEmitter<void>();
  @Output() missionsUpdated = new EventEmitter<Mission[]>();

  missions: Mission[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private readonly missionService: MissionService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeProjectId();
  }

  private initializeProjectId(): void {
    if (!this.projectId) {
      const id = this.route.snapshot?.paramMap.get('id');
      if (id && !isNaN(Number(id))) {
        this.projectId = Number(id);
        this.loadMissions();
      } else {
        this.errorMessage = 'ID du projet invalide ou manquant. Veuillez accéder à cette page via un projet valide.';
      }
    } else {
      this.loadMissions();
    }
  }

  loadMissions(): void {
    if (!this.projectId) {
      this.errorMessage = 'ID du projet non défini.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.missionService.getMissionsByProjet(this.projectId)
      .pipe(take(1))
      .subscribe({
        next: (data: Mission[]) => {
          this.missions = data;
          this.missionsUpdated.emit(data);
          this.isLoading = false;
          console.log('✅ Missions chargées', this.missions);
        },
        error: (error: Error) => {
          console.error('❌ Erreur lors du chargement des missions', error);
          this.errorMessage = 'Impossible de charger les missions. Veuillez réessayer plus tard.';
          this.isLoading = false;
          this.missions = [];
        }
      });
  }

  onMissionCreated(): void {
    this.missionCree.emit();
    this.loadMissions();
  }

  refreshMissions(): void {
    this.loadMissions();
  }

  deleteMission(id: number): void {
    if (!this.projectId || !id) {
      console.error('ID de projet ou de mission invalide');
      return;
    }
  
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cette mission ?');
    if (confirmDelete) {
      this.isLoading = true;
      this.missionService.deleteMission(this.projectId, id)
        .subscribe({
          next: () => {
            this.loadMissions();
            this.isLoading = false;
          },
          error: (error: Error) => {
            console.error("Erreur lors de la suppression de la mission:", error);
            this.errorMessage = 'Impossible de supprimer la mission. Veuillez réessayer plus tard.';
            this.isLoading = false;
          }
        });
    }
  }
}