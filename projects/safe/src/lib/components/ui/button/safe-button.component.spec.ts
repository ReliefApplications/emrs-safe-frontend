import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeButtonComponent } from './safe-button.component';

describe('ButtonComponent', () => {
  let component: SafeButtonComponent;
  let fixture: ComponentFixture<SafeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
