import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaestroTpoDocRoutingModule } from './maestro-tpo-doc-routing.module';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { MaestroTpoDocComponent } from './maestro-tpo-doc.component';


@NgModule({
  declarations: [
    MaestroTpoDocComponent
  ],
  imports: [
    CommonModule,
    MaestroTpoDocRoutingModule,
    PrimeNgAngularModule
  ]
})
export class MaestroTpoDocModule { }
