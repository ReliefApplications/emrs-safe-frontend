import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsComponent } from './applications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { AddApplicationComponent } from './components/add-application/add-application.component';
import { SafeAccessModule, SafeButtonModule, SafeConfirmModalModule } from '@safe/builder';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { ChoseRoleComponent } from './components/chose-role/chose-role.component';
import { DuplicateApplicationModule } from '../../../components/duplicate-application/duplicate-application.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [ApplicationsComponent, AddApplicationComponent, ChoseRoleComponent],
    imports: [
        CommonModule,
        ApplicationsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatChipsModule,
        SafeConfirmModalModule,
        SafeAccessModule,
        DuplicateApplicationModule,
        MatDatepickerModule,
        MatNativeDateModule,
        SafeButtonModule
    ],
  exports: [ApplicationsComponent]
})
export class ApplicationsModule { }
