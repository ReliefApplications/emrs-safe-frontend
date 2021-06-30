import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeImportRecordsTokensModalComponent } from './import-records-tokens-modal.component';

describe('SafeImportRecordsTokensModalComponent', () => {
  let component: SafeImportRecordsTokensModalComponent;
  let fixture: ComponentFixture<SafeImportRecordsTokensModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeImportRecordsTokensModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeImportRecordsTokensModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
