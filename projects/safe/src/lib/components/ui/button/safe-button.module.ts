import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonComponent } from './safe-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [SafeButtonComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  exports: [SafeButtonComponent]
})
export class SafeButtonModule {
}
