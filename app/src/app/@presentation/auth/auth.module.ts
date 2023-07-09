import { Footer, MessageService } from 'primeng/api';
import { PagesComponentsModule } from './../pages/componentes/components.module';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../prime-ng-angular.module';
import { HeaderExternalComponent } from './header-external/header-external.component';
import { SidenavComponent } from '../pages/componentes/sidenav/sidenav.component';
import { FooterExternalComponent } from './footer-external/footer-external.component';

@NgModule({
  imports: [
    AuthRoutingModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
    PagesComponentsModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    HeaderExternalComponent,
    FooterExternalComponent
  ],
  providers:[
    MessageService
  ],
  exports: [
    HeaderExternalComponent,
    FooterExternalComponent
  ]
})
export class AuthModule {}
