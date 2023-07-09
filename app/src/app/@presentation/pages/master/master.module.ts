import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../prime-ng-angular.module';
import { HistoricalService } from 'src/app/@data/services/historical.service';
import { MasterComponent } from './master.component';
import { MasterRoutingModule } from './master-routing.module';


@NgModule({
  declarations: [
    MasterComponent,
  ],
  imports: [
    MasterRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule
  ],
  providers: [
    HistoricalService
  ],
})
export class MasterModule { }
