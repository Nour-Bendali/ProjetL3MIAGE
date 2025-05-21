// src/app/personnel/personnel.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, Location, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PersonnelService, Personnel } from '../services/personnel.service';

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {
  projectId!: number;
  userId!: number;
  createurId!: number;
  isCreator = false;

  allPersonnel: Personnel[]      = [];
  assignedPersonnel: Personnel[] = [];
  availablePersonnel: Personnel[] = [];

  selectedAvailablePersonnelId: number | null = null;
  selectedAssignedPersonnelId:  number | null = null;

  message = '';

  constructor(
    private route: ActivatedRoute,
    private svc: PersonnelService,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const uid = localStorage.getItem('userId');
      this.userId = uid ? +uid : -1;
    } else {
      this.userId = -1;
    }

    this.projectId = +this.route.snapshot.paramMap.get('id')!;

    this.loadProjetDetails();
    this.loadAllPersonnel();
    this.loadAssignedPersonnel();
  }

  private loadProjetDetails(): void {
    if (!this.projectId) return;
    this.svc.getProjet(this.projectId).subscribe({
      next: proj => {
        this.createurId = proj.CreateurId;
        this.isCreator  = this.userId === this.createurId;
      },
      error: () => {
        this.message = 'erreur chargement projet';
        alert(this.message);
      }
    });
  }

  private loadAllPersonnel(): void {
    this.svc.getAllPersonnel().subscribe({
      next: (all: Personnel[]) => {
        this.allPersonnel = all;
        this.updateAvailable();
      },
      error: () => {
        this.message = 'Erreur chargement personnel global.';
        alert(this.message);
      }
    });
  }

  private loadAssignedPersonnel(): void {
    this.svc.getPersonnelProjet(this.projectId).subscribe({
      next: (asg: Personnel[]) => {
        this.assignedPersonnel = asg;
        this.updateAvailable();
      },
      error: () => {
        this.message = 'erreur personnels ';
        alert(this.message);
      }
    });
  }

  private updateAvailable(): void {
    this.availablePersonnel = this.allPersonnel.filter(
      p => !this.assignedPersonnel.some(a => a.Identifiant === p.Identifiant)
    );
    this.selectedAvailablePersonnelId = null;
    this.selectedAssignedPersonnelId  = null;
  }

  addMember(): void {
    // if (!this.isCreator) { … }
    const id = this.selectedAvailablePersonnelId;
    if (!id) {
      this.message = 'Veuillez sélectionner un membre.';
      alert(this.message);
      return;
    }
    this.svc.ajouterPersonneAuProjet(this.projectId, id).subscribe({
      next: () => {
        this.message = 'Membre ajouté avec succès.';
        alert(this.message);
        this.loadAssignedPersonnel();
      },
      error: () => {
        this.message = 'Erreur lors de l’ajout.';
        alert(this.message);
      }
    });
  }

  removeMember(): void {
    // if (!this.isCreator) { … }
    const id = this.selectedAssignedPersonnelId;
    if (!id) {
      this.message = 'Veuillez sélectionner un membre.';
      alert(this.message);
      return;
    }
    if (!confirm('Confirmez la suppression ?')) return;
    this.svc.supprimerPersonneDuProjet(this.projectId, id).subscribe({
      next: () => {
        this.message = 'Membre supprimé avec succès.';
        alert(this.message);
        this.loadAssignedPersonnel();
      },
      error: () => {
        this.message = 'Erreur lors de la suppression.';
        alert(this.message);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
