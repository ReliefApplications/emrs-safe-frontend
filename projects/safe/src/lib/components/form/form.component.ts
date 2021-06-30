import { Apollo } from 'apollo-angular';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as Survey from 'survey-angular';
import { AddRecordMutationResponse, ADD_RECORD, EditRecordMutationResponse, EDIT_RECORD, UploadFileMutationResponse, UPLOAD_FILE } from '../../graphql/mutations';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { LANGUAGES } from '../../utils/languages';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SafeWorkflowService } from '../../services/workflow.service';
import { SafeDownloadService } from '../../services/download.service';
import addCustomFunctions from '../../utils/custom-functions';
import { NOTIFICATIONS } from '../../const/notifications';

@Component({
  selector: 'safe-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class SafeFormComponent implements OnInit, OnDestroy {

  @Input() form!: Form;
  @Input() record?: Record;
  @Output() save: EventEmitter<{completed: boolean, hideNewRecord?: boolean}> = new EventEmitter();

  // === SURVEYJS ===
  public survey!: Survey.Model;
  public surveyLanguage: { name: string, nativeName: string } = {
    name: 'English',
    nativeName: 'English'
  };
  public usedLocales: Array<{ text: string, value: string }> = [];
  public dropdownLocales: any[] = [];
  public surveyActive = true;
  public selectedTabIndex = 0;
  private temporaryFilesStorage: any = {};

  // === SURVEY COLORS ===
  primaryColor = '#008DC9';

  // === MODIFIED AT ===
  public modifiedAt: Date | null = null;

  // === PASS RECORDS FROM WORKFLOW ===
  private isStep = false;
  private recordsSubscription?: Subscription;

  // === LOCALE STORAGE ===
  private storageId = '';
  public storageDate: Date = new Date();
  public isFromCacheData = false;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private workflowService: SafeWorkflowService,
    private downloadService: SafeDownloadService
  ) {}

  ngOnInit(): void {
    const defaultThemeColorsSurvey = Survey
      .StylesManager
      .ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.primaryColor;
    defaultThemeColorsSurvey['$main-hover-color'] = this.primaryColor;

    Survey
      .StylesManager
      .applyTheme();

    // Add custom functions for the expression question
    addCustomFunctions(Survey, this.record);

    const structure = JSON.parse(this.form.structure || '');
    this.survey = new Survey.Model(JSON.stringify(structure));
    this.survey.onClearFiles.add((survey, options) => this.onClearFiles(survey, options));
    this.survey.onUploadFiles.add((survey, options) => this.onUploadFiles(survey, options));
    this.survey.onDownloadFile.add((survey, options) => this.onDownloadFile(survey, options));
    // Unset readOnly fields if it's the record creation
    if (!this.record) {
      this.form.fields?.forEach(field => {
        if (field.readOnly) {
          this.survey.getQuestionByName(field.name).readOnly = false;
        }
      });
    }

    // Fetch cached data from local storage
    this.storageId = `record:${this.record ? 'update' : ''}:${this.form.id}`;
    const storedData = localStorage.getItem(this.storageId);
    let cachedData = storedData ? JSON.parse(storedData).data : null;
    this.storageDate = storedData ? new Date(JSON.parse(storedData).date) : new Date();
    this.isFromCacheData = !(!cachedData);
    if (this.isFromCacheData) {
      this.snackBar.openSnackBar(NOTIFICATIONS.objectLoadedFromCache('Record'));
    }

    this.isStep = this.router.url.includes('/workflow/');
    if (this.isStep) {
      this.recordsSubscription = this.workflowService.records.subscribe(records => {
        if (records.length > 0) {
          const mergedData = this.mergedData(records);
          cachedData = Object.assign({}, mergedData);
          const resourcesField = this.form.fields?.find(x => x.type === 'resources');
          if (resourcesField && resourcesField.resource === records[0].form?.resource?.id) {
            cachedData[resourcesField.name] = records.map(x => x.id);
          } else {
            this.snackBar.openSnackBar(NOTIFICATIONS.recordDoesNotMatch, { error: true });
          }
        }
      });
    }

    if (this.form.uniqueRecord && this.form.uniqueRecord.data) {
      this.survey.data = this.form.uniqueRecord.data;
      this.modifiedAt = this.form.uniqueRecord.modifiedAt || null;
    } else {
      if (cachedData) {
        this.survey.data = cachedData;
      } else {
        if (this.record && this.record.data) {
          this.survey.data = this.record.data;
          this.modifiedAt = this.record.modifiedAt || null;
        }
      }
    }

    if (this.survey.getUsedLocales().length > 1) {
      this.survey.getUsedLocales().forEach(lang => {
        const nativeName = (LANGUAGES as any)[lang].nativeName.split(',')[0];
        this.usedLocales.push({value: lang, text: nativeName});
        this.dropdownLocales.push(nativeName);
      });
    }

    if (navigator.language) {
      const clientLanguage = navigator.language.substring(0, 2);
      const code = this.survey.getUsedLocales().includes(clientLanguage) ? clientLanguage : 'en';
      this.surveyLanguage = (LANGUAGES as any)[code];
      this.survey.locale = code;
    } else {
      // TODO: check
      this.survey.locale = 'en';
    }

    this.survey.render('surveyContainer');
    this.survey.onComplete.add(this.complete);
    this.survey.showCompletedPage = false;
    if (!this.record && !this.form.canCreateRecords) {
      this.survey.mode = 'display';
    }
    this.survey.onCurrentPageChanged.add((surveyModel, options) => {
      this.selectedTabIndex = surveyModel.currentPageNo;
    });
    this.survey.onValueChanged.add(this.valueChange.bind(this));
  }

  public reset(): void {
    this.survey.clear();
    this.temporaryFilesStorage = {};
    this.survey.showCompletedPage = false;
    this.save.emit({ completed: false });
    this.survey.render();
    this.surveyActive = true;
  }

  public valueChange(): void {
    localStorage.setItem(this.storageId, JSON.stringify({ data: this.survey.data, date: new Date() }));
  }

  /*  Custom SurveyJS method, save a new record or edit existing one.
  */
  public complete = async () => {
    let mutation: any;
    this.surveyActive = false;
    const data = this.survey.data;

    // console.log('*** data ***');
    // console.log(data);

    const questionsToUpload = Object.keys(this.temporaryFilesStorage);
    for (const name of questionsToUpload) {
      const files = this.temporaryFilesStorage[name];
      for (const [index, file] of files.entries()) {
        const res = await this.apollo.mutate<UploadFileMutationResponse>({
          mutation: UPLOAD_FILE,
          variables: {
            file,
            form: this.form.id
          },
          context: {
            useMultipart: true
          }
        }).toPromise();
        if (res.errors) {
          this.snackBar.openSnackBar(res.errors[0].message, { error: true });
          return;
        } else {
          data[name][index].content = res.data?.uploadFile;
        }
      }
    }
    const questions = this.survey.getAllQuestions();
    for (const field in questions) {
      if (questions[field]) {
        const key = questions[field].getValueName();
        if (!data[key] && questions[field].getType() !== 'boolean') { data[key] = null; }
      }
    }
    this.survey.data = data;
    console.log('this.survey');
    console.log(this.survey);
    console.log('this.survey.data');
    console.log(this.survey.data);
    console.log('this.form');
    console.log(this.form);
    if (this.record || this.form.uniqueRecord) {
      const recordId = this.record ? this.record.id : this.form.uniqueRecord?.id;
      mutation = this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: recordId,
          data: this.survey.data
        }
      });
    } else {
      mutation = this.apollo.mutate<AddRecordMutationResponse>({
        mutation: ADD_RECORD,
        variables: {
          form: this.form.id,
          data: this.survey.data
        }
      });
    }
    mutation.subscribe((res: any) => {
      if (res.errors) {
        this.save.emit({ completed: false });
        this.survey.clear(false, true);
        this.surveyActive = true;
        this.snackBar.openSnackBar(res.errors[0].message, { error: true });
      } else {
        localStorage.removeItem(this.storageId);
        if (res.data.editRecord || res.data.addRecord.form.uniqueRecord) {
          this.survey.clear(false, true);
          if (res.data.addRecord) {
            this.record = res.data.addRecord;
            this.modifiedAt = this.record?.modifiedAt || null;
          } else {
            this.modifiedAt = res.data.editRecord.modifiedAt;
          }
          this.surveyActive = true;
        } else {
          this.survey.showCompletedPage = true;
        }
        if (this.form.uniqueRecord) {
          this.selectedTabIndex = 0;
        }
        this.save.emit({ completed: true, hideNewRecord: res.data.addRecord && res.data.addRecord.form.uniqueRecord });
      }
    });
  }

  /* Change language of the form.
  */
  setLanguage(ev: string): void {
    this.survey.locale = this.usedLocales.filter(locale => locale.text === ev)[0].value;
  }

  private onClearFiles(survey: Survey.SurveyModel, options: any): void {
    options.callback('success');
  }

  private onUploadFiles(survey: Survey.SurveyModel, options: any): void {
    if (this.temporaryFilesStorage[options.name] !== undefined) {
      this.temporaryFilesStorage[options.name].concat(options.files);
    } else {
      this.temporaryFilesStorage[options.name] = options.files;
    }
    let content: any[] = [];
    options
      .files
      .forEach((file: any) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          content = content.concat([
            {
              name: file.name,
              type: file.type,
              content: fileReader.result,
              file
            }
          ]);
          if (content.length === options.files.length) {
            options.callback('success', content.map((fileContent) => {
              return { file: fileContent.file, content: fileContent.content };
            }));
          }
        };
        fileReader.readAsDataURL(file);
      });
  }

  private onDownloadFile(survey: Survey.SurveyModel, options: any): void {
    if (options.content.indexOf('base64') !== -1 || options.content.indexOf('http') !== -1) {
      options.callback('success', options.content);
      return;
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.downloadService.baseUrl}/download/file/${options.content}`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('msal.idtoken')}`);
      xhr.onloadstart = () => {
        xhr.responseType = 'blob';
      };
      xhr.onload = () => {
        const file = new File([xhr.response], options.fileValue.name, { type: options.fileValue.type });
        const reader = new FileReader();
        reader.onload = (e) => {
          options.callback('success', e.target?.result);
        };
        reader.readAsDataURL(file);
      };
      xhr.send();
    }
  }

  public onShowPage(i: number): void {
    this.survey.currentPageNo = i;
    this.selectedTabIndex = i;
    if (this.survey.compareTo) {
      this.survey.currentPageNo = i;
    }
  }

  public onClear(): void {
    this.survey.clear();
    this.temporaryFilesStorage = {};
    localStorage.removeItem(this.storageId);
    this.isFromCacheData = false;
    this.survey.render();
  }

  private mergedData(records: Record[]): any {
    const data: any = {};
    // Loop on source fields
    for (const inputField of records[0].form?.fields || []) {
      // If source field match with target field
      if (this.form.fields?.some(x => x.name === inputField.name)) {
        const targetField = this.form.fields?.find(x => x.name === inputField.name);
        // If source field got choices
        if (inputField.choices || inputField.choicesByUrl) {
          // If the target has multiple choices we concatenate all the source values
          if (targetField.type === 'tagbox' || targetField.type === 'checkbox') {
            if (inputField.type === 'tagbox' || targetField.type === 'checkbox') {
              data[inputField.name] = records.reduce((o: string[], record: Record) => {
                o = o.concat(record.data[inputField.name]);
                return o;
              }, []);
            } else {
              data[inputField.name] = records.map(x => x.data[inputField.name]);
            }
          }
          // If the target has single choice we we put the common choice if any or leave it empty
          else {
            if (!records.some(x => x.data[inputField.name] !== records[0].data[inputField.name])) {
              data[inputField.name] = records[0].data[inputField.name];
            }
          }
        }
        // If source field is a free input and types are matching between source and target field
        else if (inputField.type === targetField.type) {
          // If type is text just put the text of the first record
          if (inputField.type === 'text') {
            data[inputField.name] = records[0].data[inputField.name];
          }
          // If type is different from text and there is a common value, put it. Otherwise leave empty
          else {
            if (!records.some(x => x.data[inputField.name] !== records[0].data[inputField.name])) {
              data[inputField.name] = records[0].data[inputField.name];
            }
          }
        }
      }
    }
    return data;
  }

  ngOnDestroy(): void {
    if (this.recordsSubscription) {
      this.recordsSubscription.unsubscribe();
      this.workflowService.storeRecords([]);
    }
    localStorage.removeItem(this.storageId);
  }
}
