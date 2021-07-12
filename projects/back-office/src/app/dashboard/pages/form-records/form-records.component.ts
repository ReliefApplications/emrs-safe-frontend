import { Apollo } from 'apollo-angular';
import { Component, ComponentFactory, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetFormByIdQueryResponse,
  GetRecordDetailsQueryResponse, GET_FORM_BY_ID, GET_RECORD_DETAILS
} from '../../../graphql/queries';
import {
  EditRecordMutationResponse,
  EDIT_RECORD,
  DeleteRecordMutationResponse,
  DELETE_RECORD
} from '../../../graphql/mutations';
import { extractColumns } from '../../../utils/extractColumns';
import {
  SafeRecordHistoryComponent, SafeLayoutService, SafeConfirmModalComponent,
  NOTIFICATIONS, SafeSnackBarService
} from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { SafeDownloadService } from '../../../../../../safe/src/lib/services/download.service';

@Component({
  selector: 'app-form-records',
  templateUrl: './form-records.component.html',
  styleUrls: ['./form-records.component.scss']
})
export class FormRecordsComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public id = '';
  public form: any;
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  public showSidenav = true;
  private historyId = '';

  // === HISTORY COMPONENT TO BE INJECTED IN LAYOUT SERVICE ===
  public factory?: ComponentFactory<any>;

  @ViewChild('xlsxFile') xlsxFile: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private downloadService: SafeDownloadService,
    private resolver: ComponentFactoryResolver,
    private layoutService: SafeLayoutService,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
  ) {
  }

  /*  Load the records, using the form id passed as a parameter.
  */
  ngOnInit(): void {
    this.factory = this.resolver.resolveComponentFactory(SafeRecordHistoryComponent);
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.getFormData();
    }
  }

  private getFormData(): void {
    this.loading = true;
    this.apollo.watchQuery<GetFormByIdQueryResponse>({
      query: GET_FORM_BY_ID,
      variables: {
        id: this.id,
        display: false
      }
    }).valueChanges.subscribe(res => {
      this.form = res.data.form;
      this.dataSource = this.form.records;
      this.setDisplayedColumns();
      this.loading = res.loading;
    });
  }

  /*  Modify the list of columns.
    */
  private setDisplayedColumns(): void {
    const columns: any[] = [];
    const structure = JSON.parse(this.form.structure);
    if (structure && structure.pages) {
      for (const page of JSON.parse(this.form.structure).pages) {
        extractColumns(page, columns);
      }
    }
    columns.push('_actions');
    this.displayedColumns = columns;
  }

  /*  Delete a record if authorized.
  */
  deleteRecord(id: any, e: any): void {
    e.stopPropagation();
    this.apollo.mutate<DeleteRecordMutationResponse>({
      mutation: DELETE_RECORD,
      variables: {
        id
      }
    }).subscribe(res => {
      this.dataSource = this.dataSource.filter(x => {
        return x.id !== id;
      });
      if (id === this.historyId) {
        this.layoutService.setRightSidenav(null);
      }
    });
  }

  private confirmRevertDialog(record: any, version: any): void {
    const date = new Date(parseInt(version.created, 0));
    const formatDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: `Recovery data`,
        content: `Do you confirm recovery the data from ${formatDate} to the current register?`,
        confirmText: 'Confirm',
        confirmColor: 'primary'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<EditRecordMutationResponse>({
          mutation: EDIT_RECORD,
          variables: {
            id: record.id,
            version: version.id
          }
        }).subscribe((res) => {
          this.layoutService.setRightSidenav(null);
          this.snackBar.openSnackBar(NOTIFICATIONS.dataRecovered);
        });

      }
    });
  }

  /* Opens the history of the record on the right side of the screen.
 */
  public onViewHistory(id: string): void {
    this.apollo.query<GetRecordDetailsQueryResponse>({
      query: GET_RECORD_DETAILS,
      variables: {
        id
      }
    }).subscribe(res => {
      this.historyId = id;
      this.layoutService.setRightSidenav({
        factory: this.factory,
        inputs: {
          record: res.data.record,
          revert: (item: any, dialog: any) => {
            this.confirmRevertDialog(res.data.record, item);
          }
        },
      });
    });
  }

  onDownload(type: string): void {
    const path = `download/form/records/${this.id}`;
    const fileName = `${this.form.name}.${type}`;
    const queryString = new URLSearchParams({type}).toString();
    this.downloadService.getFile(`${path}?${queryString}`, `text/${type};charset=utf-8;`, fileName);
  }

  downloadTemplate(): void {
    const path = `download/form/records/${this.id}`;
    const queryString = new URLSearchParams({type: 'xlsx', template: 'true'}).toString();
    this.downloadService.getFile(`${path}?${queryString}`, `text/xlsx;charset=utf-8;`, `${this.form.name}_template.xlsx`);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.uploadFileData(file);
  }

  uploadFileData(file: any): void {
    const path = `upload/form/records/${this.id}`;
    this.downloadService.uploadFile(path, file).subscribe(res => {
      this.xlsxFile.nativeElement.value = '';
      if (res.status === 'OK') {
        this.snackBar.openSnackBar('The records was added successfully.');
        this.getFormData();
      }
    }, (error => {
      console.log('ERROR', error);
      this.snackBar.openSnackBar(error.error, {error: true});
      this.xlsxFile.nativeElement.value = '';
    }));
  }
}
