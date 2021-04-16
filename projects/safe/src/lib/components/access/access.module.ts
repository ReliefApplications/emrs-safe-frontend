import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeAccessComponent } from './access.component';
import { SafeEditAccessComponent } from './edit-access/edit-access.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [SafeAccessComponent, SafeEditAccessComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule
  ],
  exports: [SafeAccessComponent]
})
export class SafeAccessModule { }
