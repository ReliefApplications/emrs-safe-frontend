import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SafeExpandedCommentComponent } from './expanded-comment.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SafeExpandedCommentComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [SafeExpandedCommentComponent]
})
export class SafeExpandedCommentModule { }
