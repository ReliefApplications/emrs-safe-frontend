import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiConfigurationRoutingModule } from './api-configuration-routing.module';
import { ApiConfigurationComponent } from './api-configuration.component';
import { SafeAccessModule, SafeButtonModule, SafePreviousButtonModule } from '@safe/builder';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';



@NgModule({
  declarations: [
    ApiConfigurationComponent
  ],
    imports: [
        CommonModule,
        ApiConfigurationRoutingModule,
        SafePreviousButtonModule,
        SafeAccessModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatSelectModule,
        MatOptionModule,
        SafeButtonModule
    ]
})
export class ApiConfigurationModule { }
