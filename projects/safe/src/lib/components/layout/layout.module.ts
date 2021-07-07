import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutComponent } from './layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { SafeConfirmModalModule } from '../confirm-modal/confirm-modal.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeButtonModule } from '../ui/button/safe-button.module';

@NgModule({
  declarations: [SafeLayoutComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatListModule,
        DragDropModule,
        MatBadgeModule,
        MatDividerModule,
        SafeConfirmModalModule,
        MatTooltipModule,
        SafeButtonModule
    ],
  exports: [SafeLayoutComponent]
})
export class SafeLayoutModule { }
