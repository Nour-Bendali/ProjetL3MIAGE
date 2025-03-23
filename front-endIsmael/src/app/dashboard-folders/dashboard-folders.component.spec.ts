import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFoldersComponent } from './dashboard-folders.component';

describe('DashboardFoldersComponent', () => {
  let component: DashboardFoldersComponent;
  let fixture: ComponentFixture<DashboardFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFoldersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
