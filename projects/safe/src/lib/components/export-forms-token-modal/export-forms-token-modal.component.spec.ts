import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFormsTokenModalComponent } from './export-forms-token-modal.component';

describe('ExportFormsTokenModalComponent', () => {
  let component: ExportFormsTokenModalComponent;
  let fixture: ComponentFixture<ExportFormsTokenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportFormsTokenModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFormsTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
