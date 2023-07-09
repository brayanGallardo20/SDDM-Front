import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { HistoricalService } from 'src/app/@data/services/historical.service';
import { ParametryComponent } from './parametry.component';
import { ParametryRoutingModule } from './parametry-routing.module';

@NgModule({
  declarations: [
    ParametryComponent
  ],
  imports: [
    ParametryRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule
  ],
  providers: [
    HistoricalService
  ],
})
export class ParametryModule { }
