import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { catchError, map } from 'rxjs/operators';
import { ResponseInitialRequest, ResponseRequest } from '../model/reponse-request';
import { TypeParameterRepository } from 'src/app/@domain/repository/type-parameter.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypeParameterService implements TypeParameterRepository {

  constructor(
    private http: HttpClient,
  ) {}

  list(body:any): Observable<any[]> {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tipoparametro/list`;
    return this.http.post(url, body).pipe(
      map(
        (response: ResponseInitialRequest) => {
            return response.data;
        }
      )
    );
  }

  listAll(): Observable<any[]> {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tipoparametro/listAll`;
    return this.http.get(url).pipe(
      map(
        (response: ResponseInitialRequest) => {
            return response.data;
        }
      )
    );
  }

  insert(body:any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tipoparametro/insert`;
    return this.http.post(url, body).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
    );
  }

  update(body:any): Observable<any> {

    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tipoparametro/update`;
    return this.http.put(url, body).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
    );
  }
  
  delete(data: any) : Observable<any>  {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/tipoparametro/delete`;
    return this.http.delete(url, {body: data});
  } 

}
