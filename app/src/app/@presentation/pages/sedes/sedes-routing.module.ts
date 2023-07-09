import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SedeCrudComponent } from './sede-crud/sede-crud.component';

const routes: Routes = [
  { path: '', component: SedeCrudComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SedesRoutingModule { }
