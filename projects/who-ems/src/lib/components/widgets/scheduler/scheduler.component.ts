import { Component, OnInit, Input } from '@angular/core';
import { SchedulerEvent } from '@progress/kendo-angular-scheduler';
import { Apollo } from 'apollo-angular';
import { GetResourceByIdQueryResponse, GET_RESOURCE_BY_ID, GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../../graphql/queries';

@Component({
  selector: 'who-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
/*  Scheduler widget using KendoUI.
*/
export class WhoSchedulerComponent implements OnInit {

  // === SCHEDULER ===
  private currentYear = new Date().getFullYear();
  public selectedDate: Date = new Date();
  private endlessDate: Date = new Date(2100, 1, 1);

  // === DATA ===
  public events: SchedulerEvent[] = [];
  public loading = true;

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any = null;

  constructor(
    private apollo: Apollo
  ) { }

  /*  Load the data.
  */
  ngOnInit(): void {
    if (this.settings.source) {
      this.getRecords();
    } else {
      this.loading = false;
    }
  }

  /*  Load the data, using widget parameters.
  */
  private getRecords(): void {
    if (!this.settings.from || this.settings.from === 'resource') {
      this.apollo.watchQuery<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: this.settings.source,
          display: true
        }
      }).valueChanges.subscribe(res => {
        this.loading = false;
        const scheduleData = res.data.resource.records.map(item => (
          {
            id: item.id,
            title: item.data[this.settings.events.title],
            description: this.settings.events.description ? item.data[this.settings.events.description] : null,
            start: item.data[this.settings.events.startDate] ? this.parseAdjust(item.data[this.settings.events.startDate]) : new Date(),
            end: (this.settings.events.endDate && item.data[this.settings.events.endDate]) ?
              this.parseAdjust(item.data[this.settings.events.endDate]) : this.endlessDate
          } as SchedulerEvent
        ));
        this.events = scheduleData;
      });
    } else {
      this.apollo.watchQuery<GetFormByIdQueryResponse>({
        query: GET_FORM_BY_ID,
        variables: {
          id: this.settings.source,
          display: true
        }
      }).valueChanges.subscribe(res => {
        this.loading = false;
        const scheduleData = res.data.form.records.map(item => (
          {
            id: item.id,
            title: item.data[this.settings.events.title],
            description: this.settings.events.description ? item.data[this.settings.events.description] : null,
            start: item.data[this.settings.events.startDate] ? this.parseAdjust(item.data[this.settings.events.startDate]) : new Date(),
            end: (this.settings.events.endDate && item.data[this.settings.events.endDate]) ?
              this.parseAdjust(item.data[this.settings.events.endDate]) : this.endlessDate
          } as SchedulerEvent
        ));
        this.events = scheduleData;
      });
    }
  }

  /*  Correction applied to data, to have correct format.
  */
  private parseAdjust(eventDate: string): Date {
    const date = new Date(eventDate);
    date.setFullYear(this.currentYear);
    return date;
  }
}
