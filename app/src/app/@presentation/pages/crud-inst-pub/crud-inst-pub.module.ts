import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { CrudInstPubRoutingModule } from './crud-inst-pub-routing.module';
import { CrudInstPubMainComponent } from './crud-inst-pub-main.component';
import { InfoInstPubComponent } from './info-inst-pub/info-inst-pub.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import { SedesModule } from '../sedes/sedes.module';
import { DirectivoModule } from '../directivo/directivo.module';
import { DutyModule } from '../duty/duty.module';
import { FeeModule } from '../fee/fee.module';


@NgModule({
  declarations: [
    CrudInstPubMainComponent,
    InfoInstPubComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CrudInstPubRoutingModule,
    PrimeNgAngularModule,
    CalendarModule,
    SedesModule,
    DutyModule,
    FeeModule,
    DirectivoModule
  ]
})
export class CrudInstPubModule { }
