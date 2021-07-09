import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Choices} from '../../models/choices.model';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.scss']
})
export class ConversationMessageComponent implements OnInit {

  @Input() type = '';

  @Input() imgSrc = '';

  @Input() backgroundColor = '';

  @Input() backgroundColorReply = '';

  @Input() text = '';

  @Input() reply = '';

  @Input() choices: Choices[];

  @Output() btnChoiceClick: EventEmitter<any> = new EventEmitter();
  @Output() btnChoiceCheckBoxValidateClick: EventEmitter<any> = new EventEmitter();

  public ml = '';
  public mr = '';

  public checkBoxChoices: Choices[];

  constructor() {
    // this.imgSrc = environment.profilePhotoDefault;
    this.choices = [{value: '', text: ''}];

    this.checkBoxChoices = [];
  }

  ngOnInit(): void {
    const msg = document.getElementsByClassName('messageGlobal');
    if (msg !== null) {
      if (this.reply === 'true'){
        this.ml = 'auto';
        this.mr = '0';
      }
      else {
        this.ml = '0';
        this.mr = 'auto';
      }
    }
  }

  btnChoiceClickFn($event: any , ch: Choices): void{
    this.btnChoiceClick.emit(ch);
    // console.log($event.target);
    $event.currentTarget.parentElement.setAttribute('style', 'display: none');
  }

  btnChoiceCheckBoxClickFn($event: any, ch: Choices): void {
    console.log($event.currentTarget);
    if (this.checkBoxChoices.includes(ch)){
      this.checkBoxChoices.splice(this.checkBoxChoices.indexOf(ch), 1);
    }
    else {
      this.checkBoxChoices.push(ch);
    }
  }

  btnChoiceCheckBoxValidateClickFn($event: any): void {
    this.btnChoiceCheckBoxValidateClick.emit(this.checkBoxChoices);
    $event.currentTarget.parentElement.parentElement.setAttribute('style', 'display: none');
  }
}
