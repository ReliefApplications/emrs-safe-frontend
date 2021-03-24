import { Apollo } from 'apollo-angular';
import { CompositeFilterDescriptor, filterBy, orderBy, process, SortDescriptor } from '@progress/kendo-data-query';
import {
  ExcelExportEvent, GridComponent as KendoGridComponent, GridDataResult, PageChangeEvent, PagerSettings, SelectableSettings,
  SelectionEvent
} from '@progress/kendo-angular-grid';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CONVERT_RECORD, ConvertRecordMutationResponse, DELETE_RECORD, DeleteRecordMutationResponse, EDIT_RECORD,
  EditRecordMutationResponse, PUBLISH, PUBLISH_NOTIFICATION, PublishMutationResponse, PublishNotificationMutationResponse
} from '../../../graphql/mutations';
import { WhoFormModalComponent } from '../../form-modal/form-modal.component';
import { Subscription } from 'rxjs';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { WhoConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { WhoConvertModalComponent } from '../../convert-modal/convert-modal.component';
import { Form } from '../../../models/form.model';
import { GET_RECORD_DETAILS, GetRecordDetailsQueryResponse } from '../../../graphql/queries';
import { WhoRecordHistoryComponent } from '../../record-history/record-history.component';
import { LayoutService } from '../../../services/layout.service';
import {
  Component, OnInit, OnChanges, OnDestroy, ViewChild, Input, Output, ComponentFactory, Renderer2,
  ComponentFactoryResolver, EventEmitter
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WhoSnackBarService } from '../../../services/snackbar.service';
import { WhoRecordModalComponent } from '../../record-modal/record-modal.component';
import { GradientSettings } from '@progress/kendo-angular-inputs';

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);

const DEFAULT_FILE_NAME = 'grid.xlsx';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

const DISABLED_FIELDS = ['id', 'createdAt', 'modifiedAt'];

const SELECTABLE_SETTINGS: SelectableSettings = {
  checkboxOnly: true,
  mode: 'multiple',
  drag: false
};

const PAGER_SETTINGS: PagerSettings = {
  buttonCount: 5,
  type: 'numeric',
  info: true,
  pageSizes: true,
  previousNext: true
};

const GRADIENT_SETTINGS: GradientSettings = {
  opacity: false
};

const MULTISELECT_TYPES: string[] = ['checkbox', 'tagbox'];

@Component({
  selector: 'who-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
/*  Grid widget using KendoUI.
*/
export class WhoGridComponent implements OnInit, OnChanges, OnDestroy {

  // === CONST ACCESSIBLE IN TEMPLATE ===
  public multiSelectTypes: string[] = MULTISELECT_TYPES;

  // === TEMPLATE REFERENCE TO KENDO GRID ===
  @ViewChild(KendoGridComponent)
  private grid: KendoGridComponent;

  // === DETECTION OF TRIGGER FOR INLINE EDITION ===
  private docClickSubscription: any;

  // === DATA ===
  public gridData: GridDataResult;
  private items: any[];
  private originalItems: any[] = [];
  private updatedItems: any[] = [];
  private editedRowIndex: number;
  private editedRecordId: string;
  public formGroup: FormGroup;
  private isNew = false;
  public loading = true;
  public fields: any[] = [];
  private metaFields: any;
  public detailsField: string;
  public canEdit = false;
  private dataQuery: any;
  private metaQuery: any;
  private dataSubscription: Subscription;

  // === SORTING ===
  public sort: SortDescriptor[];

  // === PAGINATION ===
  public pageSize = 10;
  public skip = 0;

  // === FILTER ===
  public filter: CompositeFilterDescriptor;

  // === SETTINGS ===
  @Input() header = true;
  @Input() settings: any = null;

  // === PARENT DATA FOR CHILDREN-GRID ===
  @Input() parent;

  // === EXCEL ===
  public excelFileName: string;

  // === ACTIONS ON SELECTION ===
  public selectedRowsIndex = [];
  public hasEnabledActions: boolean;
  public canUpdateSelectedRows: boolean;
  public canDeleteSelectedRows: boolean;
  public selectableSettings = SELECTABLE_SETTINGS;
  public pagerSettings = PAGER_SETTINGS;
  public gradientSettings = GRADIENT_SETTINGS;
  public editionActive = false;

  // === EMIT STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  // === NOTIFY CHANGE OF GRID CHILD ===
  @Output() childChanged: EventEmitter<any> = new EventEmitter();

  get hasChanges(): boolean {
    return this.updatedItems.length > 0;
  }

  // === HISTORY COMPONENT TO BE INJECTED IN LAYOUT SERVICE ===
  public factory: ComponentFactory<any>;

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private queryBuilder: QueryBuilderService,
    private layoutService: LayoutService,
    private resolver: ComponentFactoryResolver,
    private snackBar: WhoSnackBarService
  ) {
  }

  ngOnInit(): void {
    this.factory = this.resolver.resolveComponentFactory(WhoRecordHistoryComponent);
  }

  /*  Detect changes of the settings to (re)load the data.
  */
  ngOnChanges(): void {
    this.hasEnabledActions = !this.settings.actions ||
      Object.entries(this.settings.actions).filter((action) => action.includes(true)).length > 0;
    this.excelFileName = this.settings.title ? `${this.settings.title}.xlsx` : DEFAULT_FILE_NAME;

    this.dataQuery = this.queryBuilder.buildQuery(this.settings);
    this.metaQuery = this.queryBuilder.buildMetaQuery(this.settings, this.parent);
    this.metaQuery.subscribe(res => {
      for (const field in res.data) {
        if (Object.prototype.hasOwnProperty.call(res.data, field)) {
          this.metaFields = res.data[field];
        }
      }
      this.getRecords();
    });
    this.docClickSubscription = this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }

  private flatDeep(arr: any[]): any[] {
    return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val), []);
  }

  private getFields(fields: any[], prefix?: string, disabled?: boolean): any[] {
    return this.flatDeep(fields.filter(x => x.kind !== 'LIST').map(f => {
      switch (f.kind) {
        case 'OBJECT': {
          return this.getFields(f.fields, f.name, true);
        }
        default: {
          return {
            name: prefix ? `${prefix}.${f.name}` : f.name,
            title: f.label ? f.label : f.name,
            type: f.type,
            format: this.getFormat(f.type),
            editor: this.getEditor(f.type),
            filter: this.getFilter(f.type),
            meta: this.metaFields[f.name],
            disabled: disabled || DISABLED_FIELDS.includes(f.name) || this.metaFields[f.name].readOnly
          };
        }
      }
    }));
  }

  private convertDateFields(items: any[]): void {
    const dateFields = this.fields.filter(x => ['Date', 'DateTime', 'Time'].includes(x.type)).map(x => x.name);
    items.map(x => {
      for (const [key, value] of Object.entries(x)) {
        if (dateFields.includes(key)) {
          x[key] = new Date(x[key]);
        }
      }
    });
  }

  /*  Load the data, using widget parameters.
  */
  private getRecords(): void {
    this.loading = true;
    this.updatedItems = [];

    // Child grid
    if (!!this.parent) {
      this.items = this.parent[this.settings.name];
      if (this.items.length > 0) {
        this.fields = this.getFields(this.settings.fields);
        this.convertDateFields(this.items);
        this.originalItems = cloneData(this.items);
        this.detailsField = this.settings.fields.find(x => x.kind === 'LIST');
      } else {
        this.originalItems = [];
        this.fields = [];
        this.detailsField = null;
      }
      this.gridData = {
        data: this.items,
        total: this.items.length
      };
      this.loading = false;

      // Parent grid
    } else {
      if (this.dataQuery) {
        this.dataSubscription = this.dataQuery.valueChanges.subscribe(res => {
          const fields = this.settings.query.fields;
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              this.loading = false;
              this.fields = this.getFields(fields);
              this.items = cloneData(res.data[field] ? res.data[field] : []);
              this.convertDateFields(this.items);
              this.originalItems = cloneData(this.items);
              this.detailsField = fields.find(x => x.kind === 'LIST');
              if (this.detailsField) {
                Object.assign(this.detailsField, { actions: this.settings.actions });
              }
              this.gridData = {
                data: this.items,
                total: this.items.length
              };
            }
          }
        },
          () => this.loading = false);
      } else {
        this.loading = false;
      }
    }
  }

  /*  Set the list of items to display.
  */
  private loadItems(): void {
    this.gridData = {
      data: (this.sort ? orderBy((this.filter ? filterBy(this.items, this.filter) : this.items), this.sort) :
        (this.filter ? filterBy(this.items, this.filter) : this.items))
        .slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }

  /*  Display an embedded form in a modal to add new record.
    Create a record if result not empty.
  */
  public onAdd(): void {
    const dialogRef = this.dialog.open(WhoFormModalComponent, {
      data: {
        template: this.settings.addTemplate,
        locale: 'en'
      }
    });
  }

  /*  Inline edition of the data.
  */
  public cellClickHandler({ isEdited, dataItem, rowIndex }): void {
    if (!this.gridData.data[rowIndex].canUpdate || isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }

    if (this.isNew) {
      rowIndex += 1;
    }

    if (this.editedRecordId) {
      this.updateCurrent();
    }

    this.formGroup = this.createFormGroup(dataItem);
    this.editedRecordId = dataItem.id;
    this.editedRowIndex = rowIndex;

    this.grid.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler(): void {
    this.closeEditor();
  }

  /*  Update a record when inline edition completed.
  */
  public updateCurrent(): void {
    if (this.isNew) {
    } else {
      if (this.formGroup.dirty) {
        this.update(this.editedRecordId, this.formGroup.value);
      }
    }
    this.closeEditor();
  }

  private update(id: string, value: any): void {
    const item = this.updatedItems.find(x => x.id === id);
    if (item) {
      Object.assign(item, { ...value, id });
    } else {
      this.updatedItems.push({ ...value, id });
    }
    Object.assign(this.items.find(x => x.id === id), value);
  }

  /*  Close the inline edition.
  */
  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.grid.cancelCell();
    this.isNew = false;
    this.editedRowIndex = undefined;
    this.editedRecordId = undefined;
    this.formGroup = undefined;
  }

  /* Save all in-line changes and then reload data
  */
  public onSaveChanges(): void {
    this.closeEditor();
    if (this.hasChanges) {
      Promise.all(this.promisedChanges()).then(() => this.reloadData());
    }
  }

  private promisedChanges(): Promise<any>[] {
    const promises = [];
    for (const item of this.updatedItems) {
      const data = Object.assign({}, item);
      delete data.id;
      promises.push(this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: item.id,
          data
        }
      }).toPromise());
    }
    return promises;
  }

  public onCancelChanges(): void {
    this.closeEditor();
    this.updatedItems = [];
    this.items = this.originalItems;
    this.originalItems = cloneData(this.originalItems);
    this.loadItems();
  }

  /*  Detect document click to save record if outside the inline edition form.
  */
  private onDocumentClick(e: any): void {
    if (this.formGroup && !this.editionActive && this.formGroup.valid &&
      !matches(e.target, '#customGrid tbody *, #customGrid .k-grid-toolbar .k-button .k-animation-container')) {
      this.updateCurrent();
    }
  }

  private getEditor(type: any): string {
    switch (type) {
      case 'Int': {
        return 'numeric';
      }
      case 'Boolean': {
        return 'boolean';
      }
      case 'Date': {
        return 'date';
      }
      case 'DateTime': {
        return 'datetime';
      }
      case 'Time': {
        return 'time';
      }
      case 'JSON': {
        return null;
      }
      default: {
        return 'text';
      }
    }
  }

  private getFormat(type: any): string {
    switch (type) {
      case 'Date':
        return 'dd/MM/yy';
      case 'DateTime':
        return 'dd/MM/yy HH:mm';
      case 'Time':
        return 'HH:mm';
      default:
        return '';
    }
  }

  private getFilter(type: any): string {
    switch (type) {
      case 'Int': {
        return 'numeric';
      }
      case 'Boolean': {
        return 'boolean';
      }
      case 'Date': {
        return 'date';
      }
      case 'DateTime': {
        return 'date';
      }
      case 'Time': {
        return 'date';
      }
      case 'JSON': {
        return null;
      }
      default: {
        return 'text';
      }
    }
  }

  /* Generates the form group for in-line edition.
  */
  public createFormGroup(dataItem: any): FormGroup {
    const formGroup = {};
    for (const field of this.fields.filter(x => !x.disabled)) {
      if (field.type !== 'JSON' || this.multiSelectTypes.includes(field.meta.type)) {
        formGroup[field.name] = [dataItem[field.name]];
        if ((field.meta.type === 'dropdown' || this.multiSelectTypes.includes(field.meta.type)) && field.meta.choicesByUrl) {
          this.http.get(field.meta.choicesByUrl.url).toPromise().then(res => {
            field.meta.choices = field.meta.choicesByUrl.path ? res[field.meta.choicesByUrl.path] : res;
          });
        }
      } else {
        if (field.meta.type === 'multipletext') {
          const fieldGroup = {};
          for (const item of field.meta.items) {
            fieldGroup[item.name] = [dataItem[field.name] ? dataItem[field.name][item.name] : null];
          }
          formGroup[field.name] = this.formBuilder.group(fieldGroup);
        }
        if (field.meta.type === 'matrix') {
          const fieldGroup = {};
          for (const row of field.meta.rows) {
            fieldGroup[row.name] = [dataItem[field.name] ? dataItem[field.name][row.name] : null];
          }
          formGroup[field.name] = this.formBuilder.group(fieldGroup);
        }
        if (field.meta.type === 'matrixdropdown') {
          const fieldGroup = {};
          const fieldValue = dataItem[field.name];
          for (const row of field.meta.rows) {
            const rowValue = fieldValue ? fieldValue[row.name] : null;
            const rowGroup = {};
            for (const column of field.meta.columns) {
              const columnValue = rowValue ? rowValue[column.name] : null;
              rowGroup[column.name] = [columnValue];
            }
            fieldGroup[row.name] = this.formBuilder.group(rowGroup);
          }
          formGroup[field.name] = this.formBuilder.group(fieldGroup);
        }
        if (field.meta.type === 'matrixdynamic') {
          const fieldArray = [];
          const fieldValue = dataItem[field.name] ? dataItem[field.name] : [];
          for (const rowValue of fieldValue) {
            const rowGroup = {};
            for (const column of field.meta.columns) {
              const columnValue = rowValue ? rowValue[column.name] : null;
              if (this.multiSelectTypes.includes(column.cellType)) {
                rowGroup[column.name] = [columnValue];
              } else {
                rowGroup[column.name] = columnValue;
              }
            }
            fieldArray.push(this.formBuilder.group(rowGroup));
          }
          formGroup[field.name] = this.formBuilder.array(fieldArray);
        }
      }
    }
    return this.formBuilder.group(formGroup);
  }

  /*  Detect sort events and update the items loaded.
  */
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.skip = 0;
    this.loadItems();
  }

  /*  Detect pagination events and update the items loaded.
  */
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    this.loadItems();
  }

  /*  Detect filtering events and update the items loaded.
  */
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.loadItems();
  }

  /* Detect selection event and display actions available on rows.
  */
  public selectionChange(selection: SelectionEvent): void {
    if (selection.deselectedRows.length > 0) {
      const deselectIndex = selection.deselectedRows.map((item => item.index));
      this.selectedRowsIndex = [...this.selectedRowsIndex.filter((item) => !deselectIndex.includes(item))];
    }
    if (selection.selectedRows.length > 0) {
      const selectedItems = selection.selectedRows.map((item) => item.index);
      this.selectedRowsIndex = this.selectedRowsIndex.concat(selectedItems);
    }
    this.canUpdateSelectedRows = !this.gridData.data.some((x, idx) => this.selectedRowsIndex.includes(idx) && !x.canUpdate);
    this.canDeleteSelectedRows = !this.gridData.data.some((x, idx) => this.selectedRowsIndex.includes(idx) && !x.canDelete);
  }

  /* Open the form corresponding to selected row in order to update it
  */
  public onUpdateRow(items: string | string[]): void {
    const ids = (Array.isArray(items) && items.length > 1) ? items.map((i) => this.gridData.data[i].id) :
      (Array.isArray(items) ? this.gridData.data[items[0]].id : items);
    const dialogRef = this.dialog.open(WhoFormModalComponent, {
      data: {
        recordId: ids,
        locale: 'en'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.reloadData();
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
      this.layoutService.setRightSidenav({
        factory: this.factory,
        inputs: {
          record: res.data.record,
          revert: (item, dialog) => {
            this.confirmRevertDialog(res.data.record, item);
          }
        },
      });
    });
  }

  /* Opens the record on a read-only modal.
  */
  public onShowDetails(id: string): void {
    this.dialog.open(WhoRecordModalComponent, {
      data: {
        recordId: id,
        locale: 'en'
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    });
  }

  private confirmRevertDialog(record: any, version: any): void {
    const date = new Date(parseInt(version.created, 0));
    const formatDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
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
          this.reloadData();
          this.layoutService.setRightSidenav(null);
          this.snackBar.openSnackBar('The data has been recovered');
        });

      }
    });
  }

  /* Open a confirmation modal and then delete the selected record
  */
  public onDeleteRow(items: number[]): void {
    const rowsSelected = items.length;
    const dialogRef = this.dialog.open(WhoConfirmModalComponent, {
      data: {
        title: `Delete row${rowsSelected > 1 ? 's' : ''}`,
        content: `Do you confirm the deletion of ${rowsSelected > 1 ?
          'these ' + rowsSelected : 'this'} row${rowsSelected > 1 ? 's' : ''} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const promises = [];
        for (const index of items) {
          const id = this.gridData.data[index].id;
          promises.push(this.apollo.mutate<DeleteRecordMutationResponse>({
            mutation: DELETE_RECORD,
            variables: { id }
          }).toPromise());
        }
        Promise.all(promises).then(() => {
          this.reloadData();
        });
      }
    });
  }

  /* Open a dialog component which provide tools to convert the selected record
  */
  public onConvertRecord(items: number[]): void {
    const rowsSelected = items.length;
    const record: string = this.gridData.data[items[0]].id;
    const dialogRef = this.dialog.open(WhoConvertModalComponent, {
      data: {
        title: `Convert record${rowsSelected > 1 ? 's' : ''}`,
        record
      },
    });
    dialogRef.afterClosed().subscribe((value: { targetForm: Form, copyRecord: boolean }) => {
      if (value) {
        const promises = [];
        for (const index of items) {
          const id = this.gridData.data[index].id;
          promises.push(this.apollo.mutate<ConvertRecordMutationResponse>({
            mutation: CONVERT_RECORD,
            variables: {
              id,
              form: value.targetForm.id,
              copyRecord: value.copyRecord
            }
          }).toPromise());
        }
        Promise.all(promises).then(() => {
          this.reloadData();
        });
      }
    });
  }

  /* Reload data and unselect all rows
  */
  private reloadData(): void {
    if (!this.parent) {
      if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
      }
      this.dataQuery = this.queryBuilder.buildQuery(this.settings);
      this.getRecords();
    } else {
      this.childChanged.emit();
    }
    this.selectedRowsIndex = [];
  }

  /* Execute sequentially actions enabled by settings for the floating button
  */
  public async onFloatingButtonClick(): Promise<void> {
    const options = this.settings.floatingButton;
    let rowsIndexToModify = [...this.selectedRowsIndex];

    if (options.autoSave && options.modifySelectedRows) {
      const unionRows = this.selectedRowsIndex.filter(index => this.updatedItems.some(item => item.id === this.gridData.data[index].id));
      if (unionRows.length > 0) {
        await Promise.all(this.promisedRowsModifications(options.modifications, unionRows));
        this.updatedItems = this.updatedItems.filter(x => !unionRows.some(y => x.id === this.gridData.data[y].id));
        rowsIndexToModify = rowsIndexToModify.filter(x => !unionRows.includes(x));
      }
    }

    if (options.autoSave) {
      await Promise.all(this.promisedChanges());
    }
    if (options.modifySelectedRows) {
      await Promise.all(this.promisedRowsModifications(options.modifications, rowsIndexToModify));
    }
    if (this.selectedRowsIndex.length > 0) {
      const selectedRecords = this.gridData.data.filter((x, index) => this.selectedRowsIndex.includes(index));
      const promises = [];
      if (options.notify) {
        promises.push(this.apollo.mutate<PublishNotificationMutationResponse>({
          mutation: PUBLISH_NOTIFICATION,
          variables: {
            action: options.notificationMessage ? options.notificationMessage : 'Records update',
            content: selectedRecords,
            channel: options.notificationChannel
          }
        }).toPromise());
      }
      if (options.publish) {
        promises.push(this.apollo.mutate<PublishMutationResponse>({
          mutation: PUBLISH,
          variables: {
            ids: selectedRecords.map(x => x.id),
            channel: options.publicationChannel
          }
        }).toPromise());
      }
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    }
    if (options.goToNextStep) {
      this.goToNextStep.emit(true);
    } else {
      this.reloadData();
    }
  }

  /*  Return a list of promises containing all the mutations in order to modify selected records accordingly to settings.
      Apply inline edition before applying modifications.
  */
  private promisedRowsModifications(modifications: any[], rows: number[]): Promise<any>[] {
    const promises = [];
    for (const index of rows) {
      const record = this.gridData.data[index];
      const data = Object.assign({}, record);
      for (const modification of modifications) {
        data[modification.field.name] = modification.value;
      }
      delete data.id;
      delete data.__typename;
      promises.push(this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: record.id,
          data
        }
      }).toPromise());
    }
    return promises;
  }

  /* Export the grid data in Excel file.
  */
  public onExcelExport(grid: ExcelExportEvent): void {
    const data = this.gridData.data;
    const rows = grid.workbook.sheets[0].rows;
    console.log(rows);
    const matrixData = [];
    let rowIndex = 0;
    let i = 0;
    // We need to save manually matrix and matrix dropdown records to export on excel
    rows.forEach(row => {
      if (row.type === 'header') {
        row.cells.forEach(cell => {
          this.fields.forEach((field, index) => {
            if (field.name === cell.value && field.type === 'JSON') {
              console.log('json');
              data.forEach((record, dataIndex) => {
                if (field.meta.type === 'matrix') {
                  const entries = Object.entries(record[field.name]);
                  field.meta.columns.map((col, j) => {
                    const value = entries.filter(e => e.includes(col.name));
                    if (value.length > 0) {
                      const values = [];
                      value.forEach(v => values.push(v[0]));
                      matrixData.push({ row: dataIndex, position: index + j + i, value: values.toString() });
                    }
                  });
                } else if (field.meta.type === 'matrixdropdown') {
                  const keys = Object.keys(record[field.name]);
                  field.meta.columns.map((col, j) => {
                    let str = '';
                    keys.forEach(k => {
                      if (Object.keys(record[field.name][k]).includes(col.name) && !!record[field.name][k][col.name]) {
                        str += `${k} (${record[field.name][k][col.name]}) `;
                      }
                    });
                    if (str.trim().length > 0) {
                      matrixData.push({ row: dataIndex, position: index + j + i, value: str });
                    }
                  });
                }
              });
              i += field.meta.columns.length - 1;
            }
          });
        });
      }
      else if (row.type === 'data' && matrixData.length > 0) {
        matrixData.map((matrixCell, cellIndex) => {
          if (matrixCell.row === rowIndex) {
            row.cells[matrixCell.position].value = matrixCell.value;
          }
        });
        rowIndex++;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
