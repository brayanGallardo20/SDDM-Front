import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { map } from 'rxjs/operators';
import { ResponseInitialRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { Respuesta } from '../model/respuesta';
import { Utils } from 'src/app/util/utils';
import { SpecializationRepository } from 'src/app/@domain/repository/specializationrepository';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService implements SpecializationRepository {

  constructor(
    private http: HttpClient,
  ) {}

  listAll(request: any): Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/especializacion/list-paginated`, request);
  }
 
  save(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/especializacion/save`;
    return this.http.post(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  }

  update(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/especializacion/update`;
    return this.http.put(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  }

  delete(especializacionId:any): Observable<any> {

    const options = {
      body: {
        auditUsuarioModifica: Utils.obtenerNombreUser(),
        especializacionId: especializacionId,
      }
    };
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/especializacion/delete`;
    return this.http.delete(url,options).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
        )
  }
}
 