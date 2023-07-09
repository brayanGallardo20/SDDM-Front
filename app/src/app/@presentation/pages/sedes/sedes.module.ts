import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SedesRoutingModule } from './sedes-routing.module';
import { SedeCrudComponent } from './sede-crud/sede-crud.component';
import { SedeListComponent } from './sede-list/sede-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../prime-ng-angular.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SedeRegistrarActualizarComponent } from './sede-registrar-actualizar/sede-registrar-actualizar.component';


@NgModule({
  declarations: [ 
    SedeCrudComponent, SedeListComponent, SedeRegistrarActualizarComponent
  ],
  imports: [
    CommonModule,
    SedesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
  ],
  providers:[
    MessageService,
    DialogService,
    DynamicDialogRef,
    DynamicDialogConfig,
  ],
  exports:[
    SedeCrudComponent, SedeListComponent, SedeRegistrarActualizarComponent
  ]
})
export class SedesModule { }
