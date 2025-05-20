import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { HttpClientModule }                 from '@angular/common/http';
import { RouterModule, ActivatedRoute }     from '@angular/router';
import { take }                             from 'rxjs/operators';
import { CompetencesAssignComponent } from '../competences-assign/competences-assign.component';
import { MissionService, Mission, Membre, Competence } from '../services/mission.service';
import { MissionAssignComponent }           from '../mission-assign/mission-assign.component';

@Component({
  selector: 'app-mission-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MissionAssignComponent,
    CompetencesAssignComponent
  ],
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.css']
})
export class MissionListComponent implements OnInit {
  @Input() projectId?: number;
  @Output() missionCree = new EventEmitter<void>();
  @Output() missionsUpdated = new EventEmitter<Mission[]>();

  missions: (Mission & {
    membres_assignes?: Membre[];
    competences_requises?: Competence[];
  })[] = [];

  errorMessage: string | null = null;
  isLoading = false;

  constructor(
    private missionService: MissionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.projectId == null) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id && !isNaN(+id)) {
        this.projectId = +id;
      } else {
        this.errorMessage = 'ID du projet invalide ou manquant.';
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

    this.isLoading = true;
    this.errorMessage = null;

    this.missionService.getMissionsByProjet(this.projectId)
      .pipe(take(1))
      .subscribe({
        next: missions => {
          const missionPromises = missions.map(m =>
            Promise.all([
              this.missionService.getMembresParMission(m.IdMission).pipe(take(1)).toPromise(),
              this.missionService.getCompetencesByMission(m.IdMission).pipe(take(1)).toPromise()
            ]).then(([membres, competences]) => ({
              ...m,
              membres_assignes: membres,
              competences_requises: competences
            }))
          );

          Promise.all(missionPromises).then(missionsAvecTout => {
            this.missions = missionsAvecTout; // ✅ Pas de transformation destructrice ici
            this.missionsUpdated.emit(this.missions);
            this.isLoading = false;
          });
        },
        error: () => {
          this.errorMessage = 'Impossible de charger les missions.';
          this.isLoading = false;
        }
      });
  }

  refreshMissions(): void {
    this.loadMissions();
  }

  onMissionAssigned(): void {
    this.refreshMissions();
  }

  onMissionCreated(): void {
    this.missionCree.emit();
    this.loadMissions();
  }

  deleteMission(id: number): void {
    if (!this.projectId) return;
    if (!confirm('Supprimer cette mission ?')) return;
    this.isLoading = true;
    this.missionService.deleteMission(this.projectId, id)
      .subscribe({
        next: () => this.loadMissions(),
        error: () => {
          this.errorMessage = 'Impossible de supprimer la mission.';
          this.isLoading = false;
        }
      });
  }

  supprimerMembre(missionId: number, personnelId: number): void {
    const confirmation = confirm('Retirer ce membre de la mission ?');
    if (!confirmation) return;

    this.missionService.deleteMembreDeMission(missionId, personnelId)
      .pipe(take(1))
      .subscribe({
        next: () => this.refreshMissions(),
        error: err => {
          console.error('❌ Erreur suppression membre:', err);
          this.errorMessage = 'Impossible de supprimer ce membre.';
        }
      });
  }

  supprimerCompetence(missionId: number, competenceId: number): void {
    const confirmation = confirm('Supprimer cette compétence de la mission ?');
    if (!confirmation) return;

    this.missionService.deleteCompetenceFromMission(missionId, competenceId)
      .pipe(take(1))
      .subscribe({
        next: () => this.refreshMissions(),
        error: err => {
          console.error('❌ Erreur suppression compétence:', err);
          this.errorMessage = 'Impossible de supprimer la compétence.';
        }
      });
  }
}
