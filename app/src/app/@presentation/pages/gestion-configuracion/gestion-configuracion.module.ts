import { PrimeNgAngularModule } from './../../prime-ng-angular.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionConfiguracionRoutingModule } from './gestion-configuracion-routing.module';
import { GestionConfiguracionComponent } from './gestion-configuracion.component';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    GestionConfiguracionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
    GestionConfiguracionRoutingModule
  ],
  providers:[MessageService]
})
export class GestionConfiguracionModule { }
