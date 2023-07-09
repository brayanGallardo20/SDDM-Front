import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { MaestroEtapaComponent } from './maestro-etapa.component';
import { MaestroEtapaRoutingModule } from './maestro-etapa-routing.module';


@NgModule({
  declarations: [
    MaestroEtapaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
    MaestroEtapaRoutingModule
  ]
})
export class MaestroEtapaModule { }
