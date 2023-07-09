import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { ArbitrationMatterRoutingModule } from './master-arbitrationMatter-routing.module';
import { ArbitrationMatterComponent } from './master-arbitrationMatter.component';

@NgModule({
  declarations: [
    ArbitrationMatterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
    ArbitrationMatterRoutingModule
  ]
})
export class MasterArbitrationMatterModule { }
