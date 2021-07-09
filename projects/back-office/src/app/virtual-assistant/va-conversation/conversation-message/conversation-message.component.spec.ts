import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMessageComponent } from './conversation-message.component';

describe('ConversationMessageComponent', () => {
  let component: ConversationMessageComponent;
  let fixture: ComponentFixture<ConversationMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
