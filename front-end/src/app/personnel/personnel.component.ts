import { Component, OnInit } from '@angular/core';
import { PersonnelService } from '../services/personnel.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  competences: string[];
}

@Component({
  selector: 'app-personnel',
  standalone: true,
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class PersonnelComponent implements OnInit {
  personnel: Personnel[] = [];
  modalOuvert = false;
  projetId: number | null = null;

  constructor(
    private personnelService: PersonnelService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Vérifie si un ID projet est passé via l'URL
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.projetId = +params['id'];
      } else {
        this.projetId = null; // mode indépendant
      }
    });

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

  ouvrirModalPersonnel() {
    this.modalOuvert = true;
  }

  fermerModal() {
    this.modalOuvert = false;
  }

  ajouterAuProjet(personne: Personnel) {
    if (!this.projetId) {
      alert("Ce composant n'est pas lié à un projet actif.");
      return;
    }

    this.personnelService.ajouterPersonneAuProjet(this.projetId, personne.id).subscribe({
      next: () => {
        console.log(`${personne.nom} ${personne.prenom} ajouté au projet`);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout au projet:', err);
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
