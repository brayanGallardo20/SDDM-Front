import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { catchError, map } from 'rxjs/operators';
import { ResponseInitialRequest, ResponseRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { Respuesta } from '../model/respuesta';
import { TypeDocumentRepository } from 'src/app/@domain/repository/type-document.repository';
import { TypeDocumentBusquedaRequest } from '../model/request/type-document-busqueda-request';

@Injectable({
  providedIn: 'root',
})
export class TypeDocumentService implements TypeDocumentRepository {

  constructor(
    private http: HttpClient,
  ) { }

  listAll(request: TypeDocumentBusquedaRequest): Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/tipo-documento/list-paginated`, request);
  }

  listAllView(): Observable<Respuesta<any[]>> {
    return this.http.get<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/tipo-documento/listAll`);
  }

  insert(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tipo-documento`;
    return this.http.post(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  }

  update(body: any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tipo-documento`;
    return this.http.put(url, body).pipe(
      map((response: ResponseInitialRequest) => {
        response.data
      })
    );
  }

  delete(request: any): Observable<any> {

    const options = {
      body: request
    };

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tipo-documento`;
    return this.http.delete(url, options);
  }
}
