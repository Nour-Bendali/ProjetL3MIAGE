// src/app/mission-form/mission-form.component.ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mission-form.component.html',
  styleUrls: ['./mission-form.component.css']
})
export class MissionFormComponent implements OnInit {
  @Input() mission: any = {
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: ''
  };

  @Input() isEditMode = false; // 🔁 Pour gérer si c’est un ajout ou une édition
  @Output() onSave = new EventEmitter<any>(); // 📤 Émet l’objet mission

  ngOnInit(): void {
    // Si des données sont déjà fournies, elles seront affichées dans le formulaire
  }

  save(): void {
    if (!this.mission.titre || !this.mission.dateDebut || !this.mission.dateFin) {
      alert('Veuillez remplir les champs requis');
      return;
    }

    this.onSave.emit(this.mission);
    this.resetForm(); // 🔄 Optionnel si tu veux nettoyer après
  }

  resetForm(): void {
    if (!this.isEditMode) {
      this.mission = {
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: ''
      };
    }
  }
}
