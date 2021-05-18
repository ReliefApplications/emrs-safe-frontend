import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollWrapperComponent } from './infinite-scroll-wrapper.component';

@NgModule({
  declarations: [InfiniteScrollWrapperComponent],
  imports: [
    CommonModule
  ],
  exports: [InfiniteScrollWrapperComponent]
})
export class InfiniteScrollWrapperModule { }
