import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalRegistrarComponent } from './modal-registrar/modal-registrar.component';
import { ModalEliminarComponent } from './modal-eliminar/modal-eliminar.component';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { HistoricalService } from 'src/app/@data/services/historical.service';
import { MessageService } from 'primeng/api';
import { HistoricalRoutingModule } from './historical-routing.module';
import { HistoricalComponent } from './historical.component';

@NgModule({
  declarations: [
    HistoricalComponent,
    ModalRegistrarComponent,
    ModalEliminarComponent,
  ],
  imports: [
    HistoricalRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule
  ],
  providers: [
    HistoricalService,
    MessageService
  ],
})
export class HistoricalModule { }
