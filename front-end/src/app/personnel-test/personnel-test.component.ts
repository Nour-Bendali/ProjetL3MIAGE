// src/app/personnel-folders/personnel-test.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonnelComponent } from '../personnel-folders/personnel.component';

@Component({
  selector: 'app-personnel-test',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PersonnelComponent],
  template: `
    <h1>Page de test : Personnel</h1>
    <app-personnel></app-personnel>
  `
})
export class PersonnelTestComponent {}

