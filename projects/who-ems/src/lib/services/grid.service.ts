import { Injectable } from '@angular/core';
import { WhoChartSettingsComponent } from '../components/widgets/chart-settings/chart-settings.component';
import { WhoSchedulerSettingsComponent } from '../components/widgets/scheduler-settings/scheduler-settings.component';
import { WhoGridSettingsComponent } from '../components/widgets/grid-settings/grid-settings.component';
import { WhoMapSettingsComponent } from '../components/widgets/map-settings/map-settings.component';
import { WhoEditorSettingsComponent } from '../components/widgets/editor-settings/editor-settings.component';

@Injectable({
  providedIn: 'root',
})
/*  Grid service for the dashboards.
  Expose the available tiles, and find the settings from a widget.
*/
export class WhoGridService {

  // === LIST OF DEFAULT WIDGETS AVAILABLE ===
  public availableTiles = [
    {
      name: 'bar chart',
      icon: 'bar_chart',
      settings: {title: 'Bar chart', type: 'bar', source: '', xAxis: '', yAxis: ''},
      defaultCols: 2,
      defaultRows: 2,
      component: 'chart',
      settingsTemplate: WhoChartSettingsComponent
    },
    {
      name: 'donut chart',
      icon: 'donut_small',
      settings: {title: 'Donut chart', type: 'donut', source: '', xAxis: '', yAxis: ''},
      defaultCols: 2,
      defaultRows: 2,
      component: 'chart',
      settingsTemplate: WhoChartSettingsComponent
    },
    {
      name: 'line chart',
      icon: 'show_chart',
      settings: {title: 'Line chart', type: 'line', query: '', xAxis: '', yAxis: ''},
      defaultCols: 2,
      defaultRows: 2,
      component: 'chart',
      settingsTemplate: WhoChartSettingsComponent
    },
    {
      name: 'pie chart',
      icon: 'pie_chart',
      settings: {title: 'Pie chart', type: 'pie', source: '', xAxis: '', yAxis: ''},
      defaultCols: 2,
      defaultRows: 2,
      component: 'chart',
      settingsTemplate: WhoChartSettingsComponent
    },
    {
      name: 'scatter plot',
      icon: 'scatter_plot',
      settings: {title: 'Scatter chart', type: 'scatter', source: '', xAxis: '', yAxis: ''},
      defaultCols: 2,
      defaultRows: 2,
      component: 'chart',
      settingsTemplate: WhoChartSettingsComponent
    },
    {
      name: 'scheduler',
      icon: 'schedule',
      settings: {title: 'Scheduler'},
      defaultCols: 3,
      defaultRows: 3,
      component: 'scheduler',
      settingsTemplate: WhoSchedulerSettingsComponent
    },
    {
      name: 'grid',
      icon: 'view_column',
      settings: {
        title: 'New grid',
        sortable: false,
        from: 'resource',
        pageable: false,
        source: null,
        fields: [],
        toolbar: false,
        canAdd: false
      },
      defaultCols: 4,
      defaultRows: 4,
      component: 'grid',
      settingsTemplate: WhoGridSettingsComponent
    },
    {
      name: 'map',
      icon: 'explore',
      settings: {},
      defaultCols: 3,
      defaultRows: 3,
      component: 'map',
      settingsTemplate: WhoMapSettingsComponent
    },
    {
      name: 'text',
      icon: 'text_fields',
      settings: {title: 'Enter a title', text: 'Enter a content'},
      defaultCols: 3,
      defaultRows: 3,
      component: 'editor',
      settingsTemplate: WhoEditorSettingsComponent
    }
  ];

  constructor() { }

  /*  Find the settings component from the widget passed as 'tile'.
  */
  public findSettingsTemplate(tile: any): any {
    const availableTile = this.availableTiles.find(x => x.component === tile.component);
    return availableTile && availableTile.settingsTemplate ? availableTile.settingsTemplate : null;
  }
}
