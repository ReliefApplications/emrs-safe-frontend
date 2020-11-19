import { init as initCustomWidget } from './widgets/customwidget';
import { init as initFullnameComponent } from './components/fullname';
import { init as initCountryComponent } from './components/country';
import { init as initResourceInputWidget } from './widgets/inputwithresource';
import { init as initResourceComponent } from './components/resource';

/*  Execute all init methods of custom SurveyJS.
*/
export function initCustomWidgets(Survey): void{
    initCustomWidget(Survey);
    initFullnameComponent(Survey);
    initCountryComponent(Survey);
    initResourceInputWidget(Survey);
    initResourceComponent(Survey);
}