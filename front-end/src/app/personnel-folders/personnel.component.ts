import { Component, OnInit } from '@angular/core';
import { PersonnelService } from '../services/personnel.service';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  competences: string[];
}

@Component({
  selector: 'app-personnel',
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {
  personnel: Personnel[] = [];

  constructor(private personnelService: PersonnelService) { }

  ngOnInit(): void {
    this.chargerPersonnel();
  }

  chargerPersonnel() {
    this.personnelService.getAllPersonnel().subscribe({
      next: (data) => {
        this.personnel = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du personnel:', err);
      }
    });
  }

  ajouterPersonne(personne: Personnel) {
    this.personnelService.createPersonnel(personne).subscribe({
      next: (nouveauPersonnel) => {
        this.personnel.push(nouveauPersonnel);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
      }
    });
  }

  supprimerPersonne(id: number) {
    this.personnelService.deletePersonnel(id).subscribe({
      next: () => {
        this.personnel = this.personnel.filter(p => p.id !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
      }
    });
  }
}