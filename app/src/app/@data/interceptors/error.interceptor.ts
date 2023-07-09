import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, NEVER, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService,
    private messageService: MessageService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const started = Date.now();
    let ok: string;


    return next.handle(request)

      /*   
        .pipe(
            tap({
              // Succeeds when there is a response; ignore other events
              next: (event) =>{
              },
    
              // Operation failed; error is an HttpErrorResponse
              error: (error) => {
                console.log(error)
               if (error.status === 0) {
                this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Se perdió conexión con el servidor` });
              }
               else if (error.status === 401) {
                this.loginService.cerrarSesion();
              }  
              else if(error.status === 400) { 
                  this.messageService.add({ key: 'toast', severity: 'warn', summary: `${error.error.mensaje}`, detail: '' });
              }
              else if(error.status === 404) {
                this.messageService.add({ key: 'toast', severity: 'warn', summary: `${error.error.mensaje}`, detail: '' });
              }
              else if (error.status === 500) {
                this.messageService.add({ key: 'toast', severity: 'error', summary: `${error.error.mensaje}`, detail: '' });
              }  
              else {
                this.messageService.add({ key: 'toast', severity: 'error', summary: `${error.error.mensaje}`, detail: '' });
              }   
              
              }
            }),
            // Log when response observable either completes or errors
            finalize(() => {
              const elapsed = Date.now() - started;
              const msg = `${request.method} "${request.urlWithParams}"
                 ${ok} in ${elapsed} ms.`;
                 //this.messageService.add({ key: 'toast', severity: 'success', summary: `${msg}`, detail: '' });
            })
          )  */


      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 0) {
            this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Se perdió conexión con el servidor` });
          }
          else if (err.status === 401) {
            this.loginService.cerrarSesion();
          }
          else if ([400, 404, 500].includes(err.status)) { 
            if(err.error.mensaje){
              this.messageService.add({ key: 'toast', severity: 'warn', summary: `${err.error.mensaje}`, detail: '' });
            }else{
              this.messageService.add({ key: 'toast', severity: 'warn', summary: `${err.message}`, detail: '' });
            } 
          }
          else {
            this.messageService.add({ key: 'toast', severity: 'error', summary: `${err.error.mensaje}`, detail: '' });
            //  console.log(err)
          }
          return EMPTY

          /*      let val:HttpResponse<any> = new HttpResponse({
                 status: err.status,
                 body: {
                   data: null,
                   error: {
                     message: "errorMessage",
                     code: "error.status"
                   }
                 }
               });
               return of(val); */




        })
      );
  }
}
