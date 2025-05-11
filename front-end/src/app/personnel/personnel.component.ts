// src/app/personnel/personnel.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'; // Ajout pour récupérer IdProjet

@Component({
  selector: 'app-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personnel.component.html',
  styleUrls: ['./personnel.component.css']
})
export class PersonnelComponent implements OnInit {
  personnelList: any[] = [];
  filteredPersonnel: any[] = [];
  newPersonnel = { prenom: '', nom: '', User: '', password: '' };
  editPersonnel: any = null;
  searchQuery: string = '';
  message: string = '';
  projectId: number | null = null; // Pour stocker IdProjet

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupérer IdProjet depuis l'URL
    this.route.params.subscribe(params => {
      this.projectId = +params['id']; // Convertir en nombre
      if (this.projectId) {
        this.loadPersonnel();
      } else {
        this.message = 'ID du projet non spécifié.';
      }
    });
  }

  loadPersonnel(): void {
    if (!this.projectId) return;

    this.http.get(`http://localhost:3000/api/projets/${this.projectId}/membres`).subscribe({
      next: (data: any) => {
        this.personnelList = data;
        this.filteredPersonnel = data;
        console.log('✅ Membres du projet chargés', this.personnelList);
      },
      error: (error) => {
        console.error('❌ Erreur lors du chargement des membres', error);
        this.message = 'Erreur lors du chargement des membres.';
      }
    });
  }

  filterPersonnel(): void {
    if (!this.searchQuery) {
      this.filteredPersonnel = this.personnelList;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredPersonnel = this.personnelList.filter(person =>
        person.Prenom.toLowerCase().includes(query) ||
        person.Nom.toLowerCase().includes(query) ||
        person.User.toLowerCase().includes(query)
      );
    }
  }

  addPersonnel(): void {
    if (!this.newPersonnel.prenom || !this.newPersonnel.nom || !this.newPersonnel.User || !this.newPersonnel.password) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }

    this.http.post('http://localhost:3000/api/personnel', this.newPersonnel).subscribe({
      next: (response: any) => {
        console.log('✅ Membre ajouté', response);
        this.message = 'Membre ajouté avec succès.';
        this.newPersonnel = { prenom: '', nom: '', User: '', password: '' };
        this.loadPersonnel();
      },
      error: (error) => {
        console.error('❌ Erreur lors de l’ajout', error);
        this.message = 'Erreur lors de l’ajout du membre.';
      }
    });
  }

  startEdit(person: any): void {
    this.editPersonnel = { ...person };
  }

  saveEdit(): void {
    if (!this.editPersonnel.Prenom || !this.editPersonnel.Nom || !this.editPersonnel.User) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }

    this.http.put(`http://localhost:3000/api/personnel/${this.editPersonnel.Identifiant}`, this.editPersonnel).subscribe({
      next: () => {
        console.log('✅ Membre modifié');
        this.message = 'Membre modifié avec succès.';
        this.editPersonnel = null;
        this.loadPersonnel();
      },
      error: (error) => {
        console.error('❌ Erreur lors de la modification', error);
        this.message = 'Erreur lors de la modification du membre.';
      }
    });
  }

  deletePersonnel(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      this.http.delete(`http://localhost:3000/api/personnel/${id}`).subscribe({
        next: () => {
          console.log('✅ Membre supprimé');
          this.message = 'Membre supprimé avec succès.';
          this.loadPersonnel();
        },
        error: (error) => {
          console.error('❌ Erreur lors de la suppression', error);
          this.message = 'Erreur lors de la suppression du membre.';
        }
      });
    }
  }

  cancelEdit(): void {
    this.editPersonnel = null;
    this.message = '';
  }
}