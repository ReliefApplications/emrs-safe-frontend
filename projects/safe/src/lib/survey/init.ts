// This is needed for compilation of surveyjs-widgets with strict option enabled.
// tslint:disable-next-line: no-reference
/// <reference path="../../typings/surveyjs-widgets/index.d.ts" />

import * as widgets from 'surveyjs-widgets';
import { init as initCountryComponent } from './components/country';
import { init as initCountriesComponent } from './components/countries';
import { init as initResourceComponent } from './components/resource';
import { init as initResourcesComponent } from './components/resources';
import addCustomFunctions from '../utils/custom-functions';
import { init as initCustomWidget } from './widget';
import { init as initMultiLevelDropdownsComponent } from './components/multileveldropdown';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { DomService } from '../services/dom.service';
import { HttpClient } from '@angular/common/http';

/*  Execute all init methods of custom SurveyJS.
*/
export function initCustomWidgets(Survey: any, domService: DomService, dialog: MatDialog, apollo: Apollo, http: HttpClient): void {
  widgets.select2tagbox(Survey);
  initCountryComponent(Survey);
  initCountriesComponent(Survey);
  initResourceComponent(Survey, apollo);
  initResourcesComponent(Survey, apollo);
  initCustomWidget(Survey, domService, dialog);
  initMultiLevelDropdownsComponent(Survey, http);
  addCustomFunctions(Survey);
}
