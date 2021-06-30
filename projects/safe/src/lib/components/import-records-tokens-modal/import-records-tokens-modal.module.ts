import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeImportRecordsTokensModalComponent } from './import-records-tokens-modal.component';

@NgModule({
  declarations: [SafeImportRecordsTokensModalComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  exports: [SafeImportRecordsTokensModalComponent]
})
export class SafeImportRecordsTokensModalModule { }
