import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaestroCodSgdRoutingModule } from './maestro-cod-sgd-routing.module';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { MaestroCodSgdComponent } from './maestro-cod-sgd.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MaestroCodSgdComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
    MaestroCodSgdRoutingModule
  ]
})
export class MaestroCodSgdModule { }
