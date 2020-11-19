import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoTileDataComponent } from './tile-data.component';

describe('WhoTileDataComponent', () => {
  let component: WhoTileDataComponent;
  let fixture: ComponentFixture<WhoTileDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoTileDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoTileDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});