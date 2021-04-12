import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoSurveyGridComponent } from './survey-grid.component';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
  declarations: [WhoSurveyGridComponent],
    imports: [
        CommonModule,
        GridModule,
        GroupModule,
        ButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatGridListModule
    ],
  exports: [WhoSurveyGridComponent]
})
export class WhoSurveyGridModule { }
