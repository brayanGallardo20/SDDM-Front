import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

import { Const } from './const';
import { Observable } from 'rxjs';
import { SubEtapaArbitralBusquedaRequest } from '../model/request/sub-etapa-arbitral-busqueda-request';
import { Respuesta } from '../model/respuesta';
import { EtapaArbitralResponse } from '../model/etapa-arbitral-response.model';

@Injectable({
  providedIn: 'root'
})
export class SubEtapaService {
  constructor(
    private http: HttpClient,
  ) { }
 
  listAll(request: SubEtapaArbitralBusquedaRequest) : Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/sub-etapa-arbitral/list-paginated`, request);
  }

  listEtapas(): Observable<EtapaArbitralResponse> {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/etapa-arbitral/list-choose`;
    return this.http.get<EtapaArbitralResponse>(url);
  }

  save(data: any) {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/sub-etapa-arbitral`;
    return this.http.post(url, data);
  }

  delete(data: any) {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/sub-etapa-arbitral`;
    return this.http.delete(url, {body: data});
  } 

  update(data: any) {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/sub-etapa-arbitral`;
    return this.http.put(url, data);
  }
}
