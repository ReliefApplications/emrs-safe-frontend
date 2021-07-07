import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { SafeButtonModule } from '@safe/builder';

@NgModule({
  declarations: [ResourcesComponent],
    imports: [
        CommonModule,
        ResourcesRoutingModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatIconModule,
        MatDialogModule,
        MatButtonModule,
        MatMenuModule,
        MatSortModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        FormsModule,
        SafeButtonModule
    ],
  exports: [ResourcesComponent]
})
export class ResourcesModule { }
