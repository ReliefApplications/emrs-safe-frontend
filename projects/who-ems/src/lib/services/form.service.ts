import { Inject, Injectable } from '@angular/core';
import * as SurveyCreator from 'survey-creator';
import * as SurveyKo from 'survey-knockout';
import * as Survey from 'survey-angular';
import { initCreatorSettings } from '../survey/creator';
import { initCustomWidgets } from '../survey/init';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(@Inject('environment') environment) {
    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(SurveyKo, `${environment.API_URL}/graphql`);

    // === STYLE ===
    SurveyCreator.StylesManager.applyTheme('darkblue');

    // === CREATOR SETTINGS ===
    initCreatorSettings(SurveyKo);

    // === CUSTOM WIDGETS / COMPONENTS ===
    initCustomWidgets(Survey, `${environment.API_URL}/graphql`);

    // === STYLE ===
    Survey.StylesManager.applyTheme('darkblue');
  }
}
