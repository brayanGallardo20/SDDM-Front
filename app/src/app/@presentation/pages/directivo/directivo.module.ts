import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectivoRoutingModule } from './directivo-routing.module';
import { DirectivoCrudComponent } from './directivo-crud/directivo-crud.component';
import { DirectivoListComponent } from './directivo-list/directivo-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../prime-ng-angular.module';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DirectivoRegistrarActualizarComponent } from './directivo-registrar-actualizar/directivo-registrar-actualizar.component';


@NgModule({
  declarations: [ 
    DirectivoCrudComponent, DirectivoListComponent, DirectivoRegistrarActualizarComponent
  ],
  imports: [
    CommonModule,
    DirectivoRoutingModule,
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
  exports: [
    DirectivoCrudComponent, DirectivoListComponent, DirectivoRegistrarActualizarComponent
  ]
})
export class DirectivoModule { }
