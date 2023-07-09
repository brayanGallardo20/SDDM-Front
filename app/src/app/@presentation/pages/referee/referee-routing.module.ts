import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RefereeComponent } from './referee.component';

const routes: Routes = [
  { path: '', component: RefereeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefereeRoutingModule {}
