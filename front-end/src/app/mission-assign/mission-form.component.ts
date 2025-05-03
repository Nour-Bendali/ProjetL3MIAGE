// src/app/mission-assign/mission-assign.component.ts

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mission-assign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mission-assign.component.html',
  styleUrls: ['./mission-assign.component.css']
})
export class MissionAssignComponent implements OnInit {
  @Input() mission: any = null; // Mission sélectionnée
  @Input() personnelList: any[] = []; // Liste des membres disponibles
  @Output() onAssign = new EventEmitter<{ missionId: number, personnelId: number }>();

  selectedPersonnelId: number | null = null;

  ngOnInit(): void {}

  assign(): void {
    if (this.mission && this.selectedPersonnelId) {
      this.onAssign.emit({
        missionId: this.mission.id,
        personnelId: this.selectedPersonnelId
      });
      this.selectedPersonnelId = null;
    }
  }
}
