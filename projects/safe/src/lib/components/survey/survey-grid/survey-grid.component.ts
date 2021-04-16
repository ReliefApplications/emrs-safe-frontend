import { Component } from '@angular/core';
import { SelectableSettings, SelectionEvent } from '@progress/kendo-angular-grid';
import { SafeConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY, MatSelect } from '@angular/material/select';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_RESOURCE_BY_ID, GetResourceByIdQueryResponse } from '../../../graphql/queries';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { SafeRecordModalComponent } from '../../record-modal/record-modal.component';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

const SELECTABLE_SETTINGS: SelectableSettings = {
  checkboxOnly: true,
  mode: 'multiple',
  drag: false
};

@Component({
  selector: 'safe-survey-grid',
  templateUrl: './survey-grid.component.html',
  styleUrls: ['./survey-grid.component.scss'],
  providers: [
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
  ]
})
export class SafeSurveyGridComponent {

  constructor(private apollo: Apollo, public dialog: MatDialog, private snackBar: SafeSnackBarService) { }

  public selectableSettings = SELECTABLE_SETTINGS;

  public allData: any[] = [];
  public gridData: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  public selectedRowsIndex: number[] = [];
  public canDeleteSelectedRows = false;

  fetchData(id: string, field: string): void {
    this.apollo.watchQuery<GetResourceByIdQueryResponse>({
      query: GET_RESOURCE_BY_ID,
      variables: {
        id,
        display: true
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.resource) {
        const records = res.data.resource.records || [];
        for (const record of records) {
          this.allData.push({value: record.id, text: record.data[field]});
        }
      } else {
        this.snackBar.openSnackBar('No access provided to this resource.', { error: true });
      }
    }, (err) => {
       this.snackBar.openSnackBar(err.message, { error: true });
    });
  }

  selectionChange(selection: SelectionEvent): void {
    const deselectedRows = selection.deselectedRows || [];
    const selectedRows = selection.selectedRows || [];
    if (deselectedRows.length > 0) {
      const deselectIndex = deselectedRows.map((item => item.index));
      this.selectedRowsIndex = [...this.selectedRowsIndex.filter((item) => !deselectIndex.includes(item))];
    }
    if (selectedRows.length > 0) {
      const selectedItems = selectedRows.map((item) => item.index);
      this.selectedRowsIndex = this.selectedRowsIndex.concat(selectedItems);
    }
  }

  onAdd(event: any): void {
    const matSelect: MatSelect = event.source;
    matSelect.writeValue(null);
    const value = this.allData.filter(d => d.value === event.value)[0];
    if (value) {
      const elements: any[] = this.gridData.getValue();
      elements.push(value);
      this.gridData.next(elements);
    }
  }

  public onDeleteRow(items: number[]): void {
    const rowsSelected = items.length;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
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
        const elements = this.gridData.getValue().filter((d, index) => !items.includes(index));
        this.gridData.next(elements);
        this.selectedRowsIndex = [];
      }
    });
  }

  public onShowDetails(index: number): void {
    this.dialog.open(SafeRecordModalComponent, {
      data: {
        recordId: this.gridData.getValue()[index].value,
      }
    });
  }

  getAvailableRecords(): any[] {
    return this.allData.filter(d => !this.gridData.getValue().includes(d));
  }

}
