import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestrosArbitroComponent } from './maestros-arbitro.component';

const routes: Routes = [
  { path: '', component: MaestrosArbitroComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestrosArbitroRoutingModule { }
