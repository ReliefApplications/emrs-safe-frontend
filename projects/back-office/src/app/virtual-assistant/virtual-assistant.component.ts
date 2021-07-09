import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SafeDownloadService} from '../../../../safe/src/lib/services/download.service';

@Component({
  selector: 'app-virtual-assistant',
  templateUrl: './virtual-assistant.component.html',
  styleUrls: ['./virtual-assistant.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VirtualAssistantComponent implements OnInit {

  // === DATA ===
  public id = '';
  public form: any;
  public iQuestion: any;
  public messages: any;
  public vaCols: number;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  constructor(private route: ActivatedRoute, private downloadService: SafeDownloadService) {
    this.vaCols = 6;
    this.iQuestion = 0;
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      console.log('this.id');
      console.log(this.id);
      this.getForm();
    });
  }

  async getForm(): Promise<void>{
    const path = `download/form/${this.id}`;
    const dataReturn = await this.downloadService.getForm(path);
    if (dataReturn.status === true) {
      // console.log(JSON.parse(dataReturn.data.structure));
      this.form = JSON.parse(dataReturn.data.structure).pages[0].elements;
      console.log('this.form');
      console.log(this.form);
      // this.form = dataReturn.data;

      // JSON.parse(form.structure).pages[0].elements

      // this.addMsg(this.form[0].type,
      //   this.form[0].name,
      //   'false',
      //   new User('assistant', 'https://www.pngarts.com/files/11/Avatar-PNG-Transparent-Image.png'),
      //   Date.now(),
      //   []);

      // for (const m of this.form){
      //   this.addMsg(m.type,
      //     m.name,
      //     'false',
      //     new User('assistant', 'https://www.pngarts.com/files/11/Avatar-PNG-Transparent-Image.png'),
      //     Date.now(),
      //     null);
      // }
    }
    else {
      // problem with the form
    }
  }

  onChatButton(event: any): void {
    console.log('onChatButton');
    if (this.vaCols !== 6) {
      this.vaCols = 6;
    }
    else {
      this.vaCols = 12;
    }
  }
}
