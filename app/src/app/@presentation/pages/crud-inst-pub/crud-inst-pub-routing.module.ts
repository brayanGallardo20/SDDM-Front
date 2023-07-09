import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudInstPubMainComponent } from './crud-inst-pub-main.component';

const routes: Routes = [
  {
    path: '',
    component: CrudInstPubMainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrudInstPubRoutingModule { }
