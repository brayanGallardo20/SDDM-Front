import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Spinkit } from 'ng-http-loader';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  template: `
    <ng-http-loader
                [backdrop]="true"
                [backgroundColor]="'#F52B37'"
                [debounceDelay]="100"
                [extraDuration]="300"
                [minDuration]="300"
                [backdropBackgroundColor]="'#DDD'"
                [spinner]="spinkit.skWave">
</ng-http-loader>
    <router-outlet></router-outlet>
    <p-toast key="toast" position="top-right" ></p-toast>
  `,
})
export class AppComponent implements OnInit {
  public spinkit = Spinkit;
  horizontalMenu: boolean = true;

  darkMode = false;

  menuColorMode = 'light';

  menuColor = 'layout-menu-light';

  themeColor = 'blue';

  layoutColor = 'blue';

  ripple = true;

  inputStyle = 'outlined';

  constructor(private primengConfig: PrimeNGConfig, private translateService: TranslateService,
    private readonly configuracionService: ConfiguracionService
  ) {
    this.configuracionService.loadConfigReload();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.translate('es');
  }
  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));
  }
} 
