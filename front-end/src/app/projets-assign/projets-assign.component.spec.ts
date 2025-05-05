import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetsAssignComponent } from './projets-assign.component';

describe('ProjetsAssignComponent', () => {
  let component: ProjetsAssignComponent;
  let fixture: ComponentFixture<ProjetsAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetsAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetsAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
