import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { catchError, map } from 'rxjs/operators';
import { ResponseInitialRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { Respuesta } from '../model/respuesta';
import { Utils } from 'src/app/util/utils';
import { SpecialtyRepository } from 'src/app/@domain/repository/specialty.repository';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService implements SpecialtyRepository {

  constructor(
    private http: HttpClient,
  ) {}

  listAll(request: any): Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/especialidad/list-paginated`, request);
  }
 
  save(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/especialidad/save`;
    return this.http.post(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  }

  update(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/especialidad/update`;
    return this.http.put(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  }

  delete(especialidadId:any): Observable<any> {

    const options = {
      body: {
        auditUsuarioModifica: Utils.obtenerNombreUser(),
        especialidadId: especialidadId,
      }
    };
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/especialidad/delete`;
    return this.http.delete(url,options).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
        )
  }
}
 