import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSurveyGridComponent } from './survey-grid.component';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [SafeSurveyGridComponent],
    imports: [
        CommonModule,
        GridModule,
        GroupModule,
        ButtonModule,
        MatSelectModule,
        MatDialogModule
    ],
  exports: [SafeSurveyGridComponent]
})
export class SafeSurveyGridModule { }
