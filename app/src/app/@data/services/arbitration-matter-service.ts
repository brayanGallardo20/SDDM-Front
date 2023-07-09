import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { catchError, map } from 'rxjs/operators';
import { ResponseInitialRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { EtapaRepository } from 'src/app/@domain/repository/etapa.repository';
import { Respuesta } from '../model/respuesta';
import { Utils } from 'src/app/util/utils';
import { ArbitrationMatterModel } from '../model/arbitrationMatter.model';

@Injectable({
  providedIn: 'root',
})
export class ArbitrationMatterService implements EtapaRepository {

  constructor(
    private http: HttpClient,
  ) {}

  listAll(request: any): Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/material-arbitral/list-paginated`, request);
  }
 
  save(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/material-arbitral/save`;
    return this.http.post(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  }

  update(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/material-arbitral/update`;
    return this.http.put(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  }

  delete(materiaArbitralId:any): Observable<any> {

    const options = {
      body: {
        auditUsuarioModifica: Utils.obtenerNombreUser(),
        materiaArbitralId: materiaArbitralId,
      }
    };
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/material-arbitral/delete`;
    return this.http.delete(url,options).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
        )
  }

  listChoose(): Observable<Respuesta<ArbitrationMatterModel[]>> {
    return this.http.get<Respuesta<ArbitrationMatterModel[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/material-arbitral/list-choose`);
  }
}
 