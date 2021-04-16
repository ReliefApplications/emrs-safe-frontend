import { MatDialog } from '@angular/material/dialog';
import { SafeFormModalComponent } from '../components/form-modal/form-modal.component';
import { SafeSurveyGridComponent } from '../components/survey/survey-grid/survey-grid.component';
import { DomService } from '../services/dom.service';

function addZero(i: any): string {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

export function init(Survey: any, domService: DomService, dialog: MatDialog): void {
    const widget = {
        name: 'custom-widget',
        widgetIsLoaded(): boolean {
            return true;
        },
        isFit(question: any): any {
            return true;
        },
        init(): void {
            Survey.Serializer.addProperty('question', {
                name: 'tooltip:text',
                category: 'general'
            });
        },
        isDefaultRender: true,
        afterRender(question: any, el: any): void {
            // Correction of date inputs
            if (question.value && ['date', 'datetime', 'datetime-local', 'time'].includes(question.inputType)) {
                const date = new Date(question.value);
                const year = date.getFullYear();
                const month = addZero(date.getMonth() + 1);
                const day = addZero(date.getDate());
                const hour = addZero(date.getUTCHours());
                const minutes = addZero(date.getUTCMinutes());
                switch (question.inputType) {
                    case 'date':
                        question.value = `${year}-${month}-${day}`;
                        break;
                    case 'datetime':
                        break;
                    case 'datetime-local':
                        question.value = `${year}-${month}-${day}T${hour}:${minutes}`;
                        break;
                    case 'time':
                        question.value = `${hour}:${minutes}`;
                        break;
                    default:
                        break;
                }
                el.value = question.value;
            }
            // Display of tooltip
            if (question.tooltip) {
                const header = el.parentElement.parentElement.querySelector('h5');
                if (header) {
                    header.title = question.tooltip;
                    const span = document.createElement('span');
                    span.innerText = 'info';
                    span.className = 'material-icons';
                    span.style.fontSize = '1em';
                    span.style.cursor = 'pointer';
                    header.appendChild(span);
                }
            }
            // Display of add button for resource question
            if (question.getType() === 'resource') {
                const mainDiv = document.createElement('div');
                mainDiv.id = 'addRecordDiv';
                const btnEl = document.createElement('button');
                btnEl.innerText = 'Add new record';
                btnEl.style.width = '150px';
                if (question.canAddNew && question.addTemplate) {
                    btnEl.onclick = () => {
                        const dialogRef = dialog.open(SafeFormModalComponent, {
                            data: {
                                template: question.addTemplate,
                                locale: question.resource
                            }
                        });
                        dialogRef.afterClosed().subscribe(res => {
                            if (res) {
                                const e = new CustomEvent('saveResourceFromEmbed',
                                    { detail: { resource: res.data, template: res.template } });
                                document.dispatchEvent(e);
                            }
                        });
                    };
                }
                mainDiv.appendChild(btnEl);
                el.parentElement.insertBefore(mainDiv, el);
                mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';

                question.registerFunctionOnPropertyValueChanged('addTemplate',
                    () => {
                        mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';
                    });
                question.registerFunctionOnPropertyValueChanged('canAddNew',
                    () => {
                        mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';
                    });
            }
            // Display of add button | grid for resources question
            if (question.getType() === 'resources') {
                if (question.resource) {
                    let instance: any;
                    if (question.displayAsGrid) {
                        const grid = domService.appendComponentToBody(SafeSurveyGridComponent, el.parentElement);
                        instance = grid.instance;
                        instance.fetchData(question.resource, question.displayField);
                        // subscribed grid data to add values to survey question.
                        instance.gridData.subscribe((value: any[]) => {
                            question.value = value.map(v => v.value);
                        });
                    }
                    const mainDiv = document.createElement('div');
                    mainDiv.id = 'addRecordDiv';
                    const btnEl = document.createElement('button');
                    btnEl.innerText = 'Add new record';
                    btnEl.style.width = '150px';
                    if (question.canAddNew && question.addTemplate) {
                        btnEl.onclick = () => {
                            const dialogRef = dialog.open(SafeFormModalComponent, {
                                data: {
                                    template: question.addTemplate,
                                    locale: question.resource
                                }
                            });
                            dialogRef.afterClosed().subscribe(res => {
                                if (res) {
                                    if (question.displayAsGrid) {
                                        instance.allData.push({ value: res.data.id, text: res.data.data[question.displayField] });
                                    } else {
                                        const e = new CustomEvent('saveResourceFromEmbed', {
                                            detail: {
                                                resource: res.data,
                                                template: res.template
                                            }
                                        });
                                        document.dispatchEvent(e);
                                    }
                                }
                            });
                        };
                    }
                    mainDiv.appendChild(btnEl);
                    el.parentElement.insertBefore(mainDiv, el);
                    mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';

                    question.registerFunctionOnPropertyValueChanged('addTemplate',
                        () => {
                            mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';
                        });
                    question.registerFunctionOnPropertyValueChanged('canAddNew',
                        () => {
                            mainDiv.style.display = !question.canAddNew || !question.addTemplate ? 'none' : '';
                        });
                }
            }
        }
    };
    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, 'customwidget');
}
