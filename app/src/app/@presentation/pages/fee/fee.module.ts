import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../prime-ng-angular.module';
import { HistoricalService } from 'src/app/@data/services/historical.service';
import { FeeComponent } from './fee.component';
import { FeeRoutingModule } from './fee-routing.module';

@NgModule({
  declarations: [
    FeeComponent,
  ],
  imports: [
    FeeRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule
  ],
  providers: [
    HistoricalService
  ],
  exports: [FeeComponent]
})
export class FeeModule { }
