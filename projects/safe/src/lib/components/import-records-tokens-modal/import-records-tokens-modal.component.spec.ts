import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRecordsTokensModalComponent } from './import-records-tokens-modal.component';

describe('ImportRecordsTokensModalComponent', () => {
  let component: ImportRecordsTokensModalComponent;
  let fixture: ComponentFixture<ImportRecordsTokensModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportRecordsTokensModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportRecordsTokensModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
