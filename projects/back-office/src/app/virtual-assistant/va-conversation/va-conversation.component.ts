import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {Message} from '../models/message.model';
import {User} from '../models/user.model';
import {Choices} from '../models/choices.model';

@Component({
  selector: 'app-va-conversation',
  templateUrl: './va-conversation.component.html',
  styleUrls: ['./va-conversation.component.scss']
})
export class VaConversationComponent implements OnInit, OnChanges {

  @Input() form: any[] = [];
  public records: any[] = [];
  public currentRecord: any;

  public currentText: string;
  @ViewChild(CdkVirtualScrollViewport) viewport: any;

  public conv: Message[] = [];
  public iCurrentQuestion: number;

  public endConv: boolean;
  public endConvChoiceMsg: string;

  public userImgLink: string;
  public vaImgLink: string;

  public endMessage: string;

  constructor() {
    this.currentText = '';

    this.iCurrentQuestion = 0;

    this.endConvChoiceMsg = 'restart';
    this.endConv = false;

    this.currentRecord = {};

    this.userImgLink = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1024px-Circle-icons-profile.svg.png';
    this.vaImgLink = 'https://www.121outsource.com/wp-content/uploads/2018/08/virtual-assitants.png';

    this.endMessage = 'Thank you for your time, bye!';
  }

  ngOnInit(): void {
    // this.speechToTextService.endSpeechEvent.subscribe(
    //   (text) => {
    //     this.currentText = text;
    //   }
    // );
    // this.controllerService.botReplied.subscribe(
    //   () => {
    //     this.updateScrollViewPos();
    //   }
    // );

    // window.setTimeout(() => {
    //   console.log('this.form');
    //   console.log(this.form);
    //   this.sendQuestionMsg(this.form[0].name);
    //   }, 5000);
  }

  ngOnChanges(changes: SimpleChanges): void{
    if (this.form !== undefined) {
      this.sendNextQuestion();
    }
  }

  msgUpdated(msg: any): void{
    if (typeof msg === 'string'){
      this.currentText = msg;
    }
  }

  // send simple reply message (TEXT)
  sendReplyMsgText(msg: string): void {
    console.log(this.iCurrentQuestion);
    if (!this.endConv && msg !== '' && this.form[this.iCurrentQuestion - 1].type === 'text'){
      this.addMsg('', msg, 'true', new User('Me', this.userImgLink), Date.now(), []);

      // this.records.push(msg);
      // complete current record
      // -1 because the chat start with a message of the bot
      this.currentRecord[this.form[this.iCurrentQuestion - 1].name] = msg;
      this.afterReply();
    }
  }

  // send reply message after clicking on a choice (RADIOGROUP)
  sendReplyMsgChoice(ch: Choices): void {
    if (!this.endConv && ch.text !== ''){
      this.addMsg('', ch.text, 'true', new User('Me', this.userImgLink), Date.now(), []);
      this.currentRecord[this.form[this.iCurrentQuestion - 1].name] = ch.value;
      this.afterReply();
    }
  }

  // click on a validate button (CHECKBOX)
  choiceCheckBoxValidateClick(choices: any[]): void {
    let text = ''; const choicesRecord: string[] = [];

    choices.forEach((ch) => {
      choicesRecord.push(ch.value);
      text = text + ' ' + ch.text;
    });

    this.addMsg('', text, 'true', new User('Me', this.userImgLink), Date.now(), []);
    this.currentRecord[this.form[this.iCurrentQuestion - 1].name] = choicesRecord;
    this.afterReply();
  }

  // send final conversation message
  sendReplyMsgTextEnd(): void {
    if (this.endConvChoiceMsg !== '') {
      this.addMsg('', this.endConvChoiceMsg, 'true', new User('Me', this.userImgLink), Date.now(), []);
      this.afterReply();
    }
  }

  afterReply(): void {
    // reset input text
    this.currentText = '';
    this.updateScrollViewPos();
    this.sendNextQuestion();
  }

  restartForm(): void {
    this.endConv = false;
    this.sendReplyMsgTextEnd();
    this.iCurrentQuestion = 0;
    this.currentRecord = {};
    window.setTimeout(() => {
      this.sendNextQuestion();
    }, 500);
  }

  sendNextQuestion(): void {
    if (this.iCurrentQuestion < this.form.length){
      const r = this.questionController();
      this.iCurrentQuestion++;
      this.updateScrollViewPos();
      if (!r){
        this.sendNextQuestion();
      }
    }
    else if (this.iCurrentQuestion === this.form.length) {
      this.endConv = true;

      // add this record
      this.records.push(this.currentRecord);
      console.log(this.records);

      this.addMsg('text', this.endMessage, 'false', new User('Assistant', this.vaImgLink), Date.now(),
        [new Choices(this.endConvChoiceMsg, this.endConvChoiceMsg + '?')]);

      this.iCurrentQuestion++;
      this.updateScrollViewPos();
    }
  }

  // control the bot format message depending on the type
  questionController(): boolean {
    let r = true;
    switch (this.form[this.iCurrentQuestion].type){
      case 'text':
        this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].title, 'false',
          new User('Assistant', this.vaImgLink), Date.now(), []);
        break;
      case 'radiogroup':
      case 'checkbox':
        this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].title, 'false',
          new User('Assistant', this.vaImgLink), Date.now(), this.form[this.iCurrentQuestion].choices);
        break;
      case 'expression':
        if (this.form[this.iCurrentQuestion].description){
          this.addMsg(this.form[this.iCurrentQuestion].type, this.form[this.iCurrentQuestion].description, 'false',
            new User('Assistant', this.vaImgLink), Date.now(), []);
        }
        r = false;
        break;
      default:
        r = false;
        break;
    }
    return r;
  }

  // click on a choice (radio)
  choiceClick(choice: Choices): void{
    if (choice.value === this.endConvChoiceMsg){
      this.restartForm();
    }
    else {
      this.sendReplyMsgChoice(choice);
    }
  }

  // add a message to the conversation
  addMsg(type: string,
         text: string,
         reply: string,
         user: User,
         date: number,
         choices: Choices[]): void {
    this.conv.push(new Message(type, text, reply, user, date, choices));
  }

  updateScrollViewPos(): void {
    setTimeout(() => {
      this.viewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 0);
    setTimeout(() => {
      this.viewport.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 50);
  }

  startSpeech(): void {
    // this.speechToTextService.start();
  }
}
