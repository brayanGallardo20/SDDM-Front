import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
// Components
import { PagesComponent } from './pages.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { NotBuildedComponent } from './miscellaneous/not-builded/not-builded.component';
import { PagesComponentsModule } from './componentes/components.module';
import { CanDeactivateGuard } from 'src/app/@data/guards/can-deactivate.guard';
import { MasterGuard } from 'src/app/@data/guards/master.guard';
import { MenuService } from 'src/app/@data/services/menu.service';
import { BreadcrumbService } from 'src/app/@data/services/breadcrumb.service';
import { DefaultPageComponent } from './default-page/default-page.component';
import { PrimeNgAngularModule } from './prime-ng-angular.module';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  imports: [
    PagesComponentsModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    PrimeNgAngularModule,
    RouterModule
  ],
  declarations: [
    PagesComponent,
    NotFoundComponent,
    NotBuildedComponent,
    DefaultPageComponent,
    //NotBuildedComponent
  ],
 providers: [CanDeactivateGuard, MasterGuard, MenuService, BreadcrumbService,
  MessageService,
  ConfirmationService],
})
export class PagesModule {}
