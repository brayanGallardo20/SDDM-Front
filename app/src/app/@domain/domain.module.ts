import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthenticationService,
} from '../@data/services';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { AuthenticationRepository } from './repository/authentication.repository';
import { MenuRepository } from './repository/menu.repository';
import { MenuService } from '../@data/services/menu.service';

const DATA_SERVICES = [
  {
    provide: AuthenticationRepository,
    useClass: AuthenticationService,
  },
  {
    provide: MenuRepository,
    useClass: MenuService,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class DomainModule {
  constructor(@Optional() @SkipSelf() parentModule: DomainModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: DomainModule,
      providers: [...DATA_SERVICES],
    } as ModuleWithProviders<any>;
  }
}
