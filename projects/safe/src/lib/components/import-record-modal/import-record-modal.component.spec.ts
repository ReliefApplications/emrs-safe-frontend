import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRecordModalComponent } from './import-record-modal.component';

describe('ImportRecordModalComponent', () => {
  let component: ImportRecordModalComponent;
  let fixture: ComponentFixture<ImportRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportRecordModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
