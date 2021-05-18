import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsTableComponent } from './applications-table.component';

describe('ApplicationsTableComponent', () => {
  let component: ApplicationsTableComponent;
  let fixture: ComponentFixture<ApplicationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
