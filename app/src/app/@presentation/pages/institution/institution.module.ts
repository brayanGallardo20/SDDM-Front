import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../prime-ng-angular.module';
import { HistoricalService } from 'src/app/@data/services/historical.service';
import { InstitutionComponent } from './institution.component';
import { InstitutionRoutingModule } from './institution-routing.module';

@NgModule({
  declarations: [
    InstitutionComponent,
  ],
  imports: [
    InstitutionRoutingModule,
    // PublicInstitutionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
  ],
  providers: [
    HistoricalService
  ],
})
export class InstitutionModule { }
