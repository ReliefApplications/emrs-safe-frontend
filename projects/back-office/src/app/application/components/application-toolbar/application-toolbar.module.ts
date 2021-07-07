import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationToolbarComponent } from './application-toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SafeConfirmModalModule, SafeButtonModule } from '@safe/builder';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ApplicationToolbarComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        SafeConfirmModalModule,
        SafeButtonModule
    ],
  exports: [ApplicationToolbarComponent]
})
export class ApplicationToolbarModule { }
