import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { MasterSpecialtyRoutingModule} from './master-specialty-routing.module';
import { MasterSpecialtyComponent } from './master-specialty.component';

@NgModule({
  declarations: [
    MasterSpecialtyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
    MasterSpecialtyRoutingModule
  ]
})
export class MasterSpecialtyModule { }
