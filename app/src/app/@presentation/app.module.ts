import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import { NgHttpLoaderModule } from 'ng-http-loader';
// Application Components
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import { PrimeNgAngularModule } from './prime-ng-angular.module';
import { DomainModule } from '../@domain/domain.module';
import { Const } from '../@data/services/const';
import {  AuthGuard, ErrorInterceptor } from '../@data/interceptors'; 
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { MessageService } from 'primeng/api';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}


@NgModule({
    imports: [ 
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        PrimeNgAngularModule,  
        NgHttpLoaderModule.forRoot(),
        DomainModule.forRoot(),
        TranslateModule.forRoot({
          defaultLanguage: 'es',
          loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
          }
      })
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
      MessageService,
      //AuthGuard,

        {
            provide: APP_INITIALIZER,
            useFactory: initCommonConfig,
            deps: [Const],
            multi: true,
          },
          {
            provide: APP_INITIALIZER,
            useFactory: initAplicationConfig,
            deps: [Const],
            multi: true,
          }, 
         { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true,  deps: [Const,MessageService] },

          // {
          //   provide: HTTP_INTERCEPTORS,
          //   useClass: BasicAuthInterceptor,
          //   multi: true,
          // },
          // {
          //   provide: HTTP_INTERCEPTORS,
          //   useClass: ErrorInterceptor,
          //   multi: true,
          // },
          // {
          //   provide: HTTP_INTERCEPTORS,
          //   useClass: MyHttpInterceptor,
          //   multi: true,
          // },
        {provide: LocationStrategy, useClass: HashLocationStrategy},

        
    ],
    bootstrap: [AppComponent],
    exports: [AppComponent]
})
export class AppModule {
}

export function tokenGetter() {
    return sessionStorage.getItem('token');
  }
  
  export function initCommonConfig(c: Const) {
    return () => c.loadCommonConfig();
  }
  
  export function initAplicationConfig(c: Const) {
    return () => c.loadAplicationConfig();
  }