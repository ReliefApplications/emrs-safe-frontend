import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeQueryBuilderComponent } from './query-builder.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeTabFieldsComponent } from './tab-fields/tab-fields.component';
import { SafeTabSortComponent } from './tab-sort/tab-sort.component';
import { SafeTabFilterComponent } from './tab-filter/tab-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    SafeQueryBuilderComponent,
    SafeTabFieldsComponent,
    SafeTabSortComponent,
    SafeTabFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSlideToggleModule
  ],
  exports: [
    SafeQueryBuilderComponent,
    SafeTabFieldsComponent
  ]
})
export class SafeQueryBuilderModule { }
