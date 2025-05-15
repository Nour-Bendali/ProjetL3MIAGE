import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencesAssignComponent } from './competences-assign.component';

describe('CompetencesAssignComponent', () => {
  let component: CompetencesAssignComponent;
  let fixture: ComponentFixture<CompetencesAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetencesAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetencesAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
