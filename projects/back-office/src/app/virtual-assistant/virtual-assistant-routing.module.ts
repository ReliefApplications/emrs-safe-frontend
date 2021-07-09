import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VirtualAssistantComponent} from './virtual-assistant.component';

const routes: Routes = [
  {
    path: '',
    component: VirtualAssistantComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VirtualAssistantRoutingModule { }
