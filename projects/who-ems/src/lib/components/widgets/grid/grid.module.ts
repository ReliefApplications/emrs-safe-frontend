import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WhoGridComponent } from './grid.component';
import { ExcelModule, GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { WhoFormModalModule } from '../../form-modal/form-modal.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { HttpClientModule } from '@angular/common/http';
import { WhoRecordModalModule } from '../../record-modal/record-modal.module';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';

@NgModule({
  declarations: [
    WhoGridComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    ExcelModule,
    ExcelExportModule,
    WhoFormModalModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    GroupModule,
    ButtonModule,
    MatCheckboxModule,
    InputsModule,
    DateInputsModule,
    DropDownsModule,
    WhoRecordModalModule
  ],
  exports: [WhoGridComponent]
})
export class WhoGridModule { }
