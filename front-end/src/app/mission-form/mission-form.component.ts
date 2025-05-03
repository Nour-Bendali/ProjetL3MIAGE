import { Component, OnInit } from '@angular/core';
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
      idProjet: ['', Validators.required]
    });

    this.projetService.getAllProjets().subscribe((data: any[]) => {
      this.projets = data;
    });
  }

  onSubmit(): void {
    if (this.missionForm.valid) {
      this.missionService.createMission(this.missionForm.value).subscribe({
        next: () => alert('Mission créée avec succès'),
        error: () => alert('Erreur lors de la création de la mission')
      });
    }
  }
}
