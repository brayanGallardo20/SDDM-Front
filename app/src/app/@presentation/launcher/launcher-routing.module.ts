import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LauncherComponent } from './launcher.component';

const routes: Routes = [
  {
    path: '',
    component: LauncherComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LauncherRoutingModule { }
