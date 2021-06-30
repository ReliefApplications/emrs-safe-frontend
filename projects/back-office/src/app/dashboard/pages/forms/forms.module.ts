import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { SafeConfirmModalModule, SafeImportRecordsTokensModalModule } from '@safe/builder';
import { AddFormModule } from '../../../components/add-form/add-form.module';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule as AngularFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormsComponent],
  imports: [
    CommonModule,
    FormsRoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    SafeConfirmModalModule,
    SafeImportRecordsTokensModalModule,
    AddFormModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    AngularFormsModule
  ],
  exports: [FormsComponent]
})
export class FormsModule { }
