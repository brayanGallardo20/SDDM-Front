import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { PrimeNgAngularModule } from './../../prime-ng-angular.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionHistoricosRoutingModule } from './gestion-historicos-routing.module';
import { GestionHistoricosComponent } from './gestion-historicos.component';
import { GhDetalleComponent } from './gh-detalle/gh-detalle.component';


@NgModule({
  declarations: [
    GestionHistoricosComponent,
    GhDetalleComponent
  ],
  imports: [
    CommonModule,
    GestionHistoricosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule
  ],
  providers:[MessageService,
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig,
  ]
})
export class GestionHistoricosModule { }
