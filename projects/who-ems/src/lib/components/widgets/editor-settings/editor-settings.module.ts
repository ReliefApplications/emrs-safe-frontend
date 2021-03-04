import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoEditorSettingsComponent } from './editor-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@progress/kendo-angular-editor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';

@NgModule({
  declarations: [WhoEditorSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    EditorModule,
    ToolBarModule
  ],
  exports: [WhoEditorSettingsComponent]
})
export class WhoEditorSettingsModule { }
