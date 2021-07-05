import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUsersComponent } from './users.component';
import { SafeEditUserComponent } from './components/edit-user/edit-user.component';
import { SafeInviteUserComponent } from './components/invite-user/invite-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [SafeUsersComponent, SafeEditUserComponent, SafeInviteUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSortModule,
    MatChipsModule,
    MatRippleModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  exports: [SafeUsersComponent]
})
export class SafeUsersModule { }
