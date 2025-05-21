import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MissionService } from '../services/mission.service';
import { ProjetService } from '../services/projet.service';

@Component({
  selector: 'app-mission-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mission-form.component.html'
})
export class MissionFormComponent implements OnInit {
  @Input() projetId?: number; // 
  @Output() missionCree = new EventEmitter<void>(); 

  missionForm!: FormGroup;
  projets: any[] = [];

  constructor(
    private fb: FormBuilder,
    private missionService: MissionService,
    private projetService: ProjetService
  ) {}

  ngOnInit(): void {
    this.missionForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      idProjet: [this.projetId ?? '', Validators.required]
    });

    // Charger les projets SEULEMENT si aucun n’est injecté
    if (!this.projetId) {
      this.projetService.getAllProjets().subscribe({
        next: (data) => {
          this.projets = data.projets ?? data; // selon la forme
        },
        error: (err) => {
          console.error(' Erreur lors du chargement des projets', err);
          alert('Erreur lors du chargement des projets.');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.projetId) {
      this.missionForm.patchValue({ idProjet: this.projetId }); // 🔁 forcer la valeur
    }

    this.missionService.createMission(this.missionForm.value).subscribe({
      next: () => {
        alert('Mission créée avec succès');
        this.missionForm.reset();
        this.missionCree.emit(); // 🔁 informer le parent de recharger les missions
      },
      error: (err) => {
        console.error('Erreur mission:', err);
        alert('Erreur lors de la création de la mission');
      }
    });
  }
}
