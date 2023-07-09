import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LauncherRoutingModule } from './launcher-routing.module';
import { LauncherComponent } from './launcher.component';
import { AuthModule } from '../auth/auth.module';


@NgModule({
  declarations: [
    LauncherComponent
  ],
  imports: [
    CommonModule,
    LauncherRoutingModule,
    AuthModule
  ]
})
export class LauncherModule { }
