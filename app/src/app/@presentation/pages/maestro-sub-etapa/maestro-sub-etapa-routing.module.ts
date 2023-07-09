import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestroSubEtapaComponent } from './maestro-sub-etapa.component';

const routes: Routes = [
  {
    path: '',
    component: MaestroSubEtapaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestroSubEtapaRoutingModule { }
