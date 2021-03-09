import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoChartSettingsComponent } from './chart-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WhoChartBuilderModule } from '../../chart-builder/chart-builder.module';
// import { WhoQueryBuilderModule } from '../../query-builder/query-builder.module';

@NgModule({
  declarations: [WhoChartSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    TextFieldModule,
    // WhoQueryBuilderModule,
    WhoChartBuilderModule
  ],
  exports: [WhoChartSettingsComponent]
})
export class WhoChartSettingsModule { }
