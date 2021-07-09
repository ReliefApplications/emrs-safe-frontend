import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaConversationComponent } from './va-conversation.component';

describe('VaConversationComponent', () => {
  let component: VaConversationComponent;
  let fixture: ComponentFixture<VaConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaConversationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
