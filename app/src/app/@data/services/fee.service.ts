import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { catchError, map } from 'rxjs/operators';
import { ResponseInitialRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { Respuesta } from '../model/respuesta';
import { Utils } from 'src/app/util/utils';
import { FeeRepository } from 'src/app/@domain/repository/fee.repository';

@Injectable({
  providedIn: 'root',
})
export class FeeService implements FeeRepository {

  constructor(
    private http: HttpClient,
  ) {}


  listAll(request:any):  Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/tarifa/list-paginated`, request);
  }
 
  insert(body:any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tarifa/insert`;
    return this.http.post(url, body).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        }),
      catchError((err) => {
       alert("ocurrio un problema");
        throw new Error(JSON.stringify(err)).message;
      })
    );
  }

  update(body:any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tarifa/update`;
    return this.http.put(url, body).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        }),
      catchError((err) => {
       alert("ocurrio un problema");
        throw new Error(JSON.stringify(err)).message;
      })
    );
  }

  delete(dutyID:any): Observable<any> {
 
    const options = {
      body: {
        auditUsuarioModifica: Utils.obtenerNombreUser(),
        tarifaId: dutyID,
      }
    };
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tarifa/delete`;
    return this.http.delete(url,options).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
        )
  }
}
