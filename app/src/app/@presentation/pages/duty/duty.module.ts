import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../prime-ng-angular.module';
import { HistoricalService } from 'src/app/@data/services/historical.service';
import { DutyComponent } from './duty.component';
import { DutyRoutingModule } from './duty-routing.module';

@NgModule({
  declarations: [
    DutyComponent,
  ],
  imports: [
    DutyRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule
  ],
  providers: [
    HistoricalService
  ],
  exports: [
    DutyComponent
  ]
})
export class DutyModule { }
