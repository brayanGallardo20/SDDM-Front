import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { MaestroSubEtapaRoutingModule } from './maestro-sub-etapa-routing.module';
import { MaestroSubEtapaComponent } from './maestro-sub-etapa.component';
import { MaestroEtapaComponent } from '../maestro-etapa/maestro-etapa.component';


@NgModule({
  declarations: [
    MaestroSubEtapaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
    MaestroSubEtapaRoutingModule
  ]
})
export class MaestroSubEtapaModule { }
