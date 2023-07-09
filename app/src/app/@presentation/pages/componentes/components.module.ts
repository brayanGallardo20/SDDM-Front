import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { PrimeNgAngularModule } from '../../prime-ng-angular.module';
import { AppMenuitemComponent } from './sidenav/app.menuitem.component';

@NgModule({
  declarations: [
    HeaderComponent,
    AppMenuitemComponent,
    SidenavComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PrimeNgAngularModule,
    
  ],
  exports: [
    HeaderComponent,
    AppMenuitemComponent,
    SidenavComponent,
    FooterComponent
  ],

})
export class PagesComponentsModule { }
