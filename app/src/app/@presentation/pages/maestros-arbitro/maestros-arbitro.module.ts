import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PrimeNgAngularModule } from './../prime-ng-angular.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaestrosArbitroRoutingModule } from './maestros-arbitro-routing.module';
import { MaestrosArbitroComponent } from './maestros-arbitro.component';
import { ArbitroRegistrarActualizarComponent } from './arbitro-registrar-actualizar/arbitro-registrar-actualizar.component';


@NgModule({
  declarations: [
    MaestrosArbitroComponent,
    ArbitroRegistrarActualizarComponent
  ],
  imports: [
    CommonModule,
    MaestrosArbitroRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
  ],
  providers:[
    MessageService,
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig,
    ConfirmationService
  ]
})
export class MaestrosArbitroModule { }
