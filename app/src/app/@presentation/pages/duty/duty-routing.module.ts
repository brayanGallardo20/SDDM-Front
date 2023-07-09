import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DutyComponent  } from './duty.component';

const routes: Routes = [
  { path: '', component:  DutyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DutyRoutingModule {}
