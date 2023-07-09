import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { catchError, map } from 'rxjs/operators';
import { ResponseInitialRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { ParameterRepository } from 'src/app/@domain/repository/parameter.repository';
import { Utils } from 'src/app/util/utils';
import { Respuesta } from '../model/respuesta';

@Injectable({
  providedIn: 'root',
})
export class ParameterService implements ParameterRepository {

  constructor(
    private http: HttpClient,
  ) {}
  
  listAll(request:any):  Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/parametro/list-paginated`, request);
  }
 
  insert(body:any): Observable<any> {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/parametro/insert`;
    return this.http.post(url, body).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
    );
  }
 
  update(body:any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/parametro/update`; 
    return this.http.put(url, body).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
    );
  }

  delete(id: any) {

    const options = {
      body: {
        auditUsuarioModifica: Utils.obtenerNombreUser(),
        parametroId: id,
      }
    };
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/parametro/delete`;
    return this.http.delete(url, options);
  } 
  
}
