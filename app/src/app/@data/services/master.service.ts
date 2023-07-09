import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { catchError, map } from 'rxjs/operators';
import { ResponseInitialRequest, ResponseRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { MasterRepository } from 'src/app/@domain/repository/master.repository';
import { MasterBusquedaRequest } from '../model/request/master-busqueda-request';
import { Respuesta } from '../model/respuesta';
import { Utils } from 'src/app/util/utils';

@Injectable({
  providedIn: 'root',
})
export class MasterService implements MasterRepository {

  constructor(
    private http: HttpClient,
  ) {}

  listAll(request: MasterBusquedaRequest): Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/maestra/list-paginated`, request);
  }

  insert(body:any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/maestra/save`;
    return this.http.post(url, body).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
    );
  }

  update(body:any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/maestra/update`;
    return this.http.put(url, body).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
    );
  } 

  delete(nombreTabla:any,id:any): Observable<any> {

    const options = {
      body: {
        maestraId: id,
        tablaMaestra: nombreTabla,
        auditUsuarioModifica: Utils.obtenerNombreUser()
      }
    };
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/maestra/deleteById`;
    return this.http.delete(url,options).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
    );
  }
}
