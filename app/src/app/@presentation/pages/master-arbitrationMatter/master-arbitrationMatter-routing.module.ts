import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArbitrationMatterComponent } from './master-arbitrationMatter.component';

const routes: Routes = [
  {
    path: '',
    component: ArbitrationMatterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArbitrationMatterRoutingModule { }
