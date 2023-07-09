import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaestroCodSgdComponent } from './maestro-cod-sgd.component';

const routes: Routes = [
  {
    path: '',
    component: MaestroCodSgdComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaestroCodSgdRoutingModule { }
