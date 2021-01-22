import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WhoTileDisplayComponent } from './tile-display.component';

describe('WhoTileDisplayComponent', () => {
  let component: WhoTileDisplayComponent;
  let fixture: ComponentFixture<WhoTileDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoTileDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoTileDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
