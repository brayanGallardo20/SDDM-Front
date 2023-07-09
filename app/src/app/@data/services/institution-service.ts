import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { map } from 'rxjs/operators';
import { ResponseInitialRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { Respuesta } from '../model/respuesta';
import { InstitutionRepository } from 'src/app/@domain/repository/institution.repository';
import { Utils } from 'src/app/util/utils';

@Injectable({
  providedIn: 'root',
}) 
export class InstitutionService implements InstitutionRepository {

  constructor(
    private http: HttpClient,
  ) {}

  listAll(request: any): Observable<Respuesta<any[]>> {
    return this.http.post<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/institution/list-paginated`, request);
  }

  findIntitutionPersona(institucionId:any): Observable<Respuesta<any[]>> {
    return this.http.get<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/institution/${institucionId}`);
  }
 
  delete(id:any): Observable<any> {
 
    const options = {
      body: {
        auditUsuarioModifica: Utils.obtenerNombreUser(),
        institucionId: id,
      }
    };
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/institution/delete`;
    return this.http.delete(url,options).pipe(
      map((response: ResponseInitialRequest) => {
          response.data
        })
        )
  }
}
 