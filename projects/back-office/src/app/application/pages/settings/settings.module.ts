import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SafeButtonModule } from '@safe/builder';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    SafeButtonModule,
  ]
})
export class SettingsModule { }
