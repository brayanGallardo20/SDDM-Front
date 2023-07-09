import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestroEtapaComponent } from './maestro-etapa.component';

const routes: Routes = [
  {
    path: '',
    component: MaestroEtapaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestroEtapaRoutingModule { }
