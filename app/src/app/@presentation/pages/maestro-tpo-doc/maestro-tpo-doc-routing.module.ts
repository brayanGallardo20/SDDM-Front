import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestroTpoDocComponent } from './maestro-tpo-doc.component';

const routes: Routes = [
  {
    path: '',
    component: MaestroTpoDocComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestroTpoDocRoutingModule { }
