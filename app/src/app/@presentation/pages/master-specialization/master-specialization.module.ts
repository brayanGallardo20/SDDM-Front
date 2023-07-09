import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { MasterSpecializationRoutingModule } from './master-specialization-routing.module';
import { MasterSpecializationComponent } from './master-specialization.component';

@NgModule({
  declarations: [
    MasterSpecializationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
    MasterSpecializationRoutingModule
  ]
})
export class MasterSpecializationModule { }
