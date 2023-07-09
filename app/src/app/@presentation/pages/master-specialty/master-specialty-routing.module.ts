import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterSpecialtyComponent } from './master-specialty.component';

const routes: Routes = [
  {
    path: '',
    component: MasterSpecialtyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSpecialtyRoutingModule { }
