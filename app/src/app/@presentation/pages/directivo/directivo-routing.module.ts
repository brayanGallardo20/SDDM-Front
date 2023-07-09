import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectivoCrudComponent } from './directivo-crud/directivo-crud.component';

const routes: Routes = [
  { path: '', component: DirectivoCrudComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectivoRoutingModule { }
