import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametryComponent } from './parametry.component';

const routes: Routes = [
  { path: '', component: ParametryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametryRoutingModule {}
