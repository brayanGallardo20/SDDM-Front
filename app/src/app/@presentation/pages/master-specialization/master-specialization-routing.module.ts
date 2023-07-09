import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterSpecializationComponent } from './master-specialization.component';

const routes: Routes = [
  {
    path: '',
    component: MasterSpecializationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSpecializationRoutingModule { }
