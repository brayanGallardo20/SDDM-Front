import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { catchError, map } from 'rxjs/operators';
import { ResponseInitialRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { EtapaRepository } from 'src/app/@domain/repository/etapa.repository';
import { Respuesta } from '../model/respuesta';
import { Utils } from 'src/app/util/utils';
import { EtapaArbitralModel } from '../model/etapa.model';

@Injectable({
  providedIn: 'root',
})
export class EtapaService implements EtapaRepository {

  constructor(
    private http: HttpClient,
  ) {}

  listAll(request: any): Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/etapa-arbitral/list-paginated`, request);
  }
 
  save(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/etapa-arbitral`;
    return this.http.post(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  } 

/*   save(request: EtapaArbitralModel): Observable<Respuesta<EtapaArbitralModel>> {
    return this.http.post<Respuesta<EtapaArbitralModel>>(`${Const.API_CENTRO_ARBITRAJE}/api/etapa-arbitral`, request)
  } */

  update(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/etapa-arbitral`;
    return this.http.put(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  }

  delete(body:any): Observable<any> {

    const options = {
      body: {
        auditUsuarioModifica: Utils.obtenerNombreUser(),
        etapaArbitralId: body.etapaArbitralId,
      }
    };
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/etapa-arbitral`;
    return this.http.delete(url,options).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
        )
  }
}
 