import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { map } from 'rxjs/operators';
import { ResponseInitialRequest } from '../model/reponse-request';
import { Observable } from 'rxjs';
import { Respuesta } from '../model/respuesta';
import { PideRepository } from 'src/app/@domain/repository/pide.repository';

@Injectable({
  providedIn: 'root',
})
export class PideService implements PideRepository {

  constructor(
    private http: HttpClient,
  ) { }
 
  findNaturalPerson(numeroDocumento:string): Observable<Respuesta<any[]>> {
    return this.http.get<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/pide/get-data-persona-natural-by-dni/${numeroDocumento}`);
  }

  findLegalPerson(numeroDocumento:string): Observable<Respuesta<any[]>> {
    return this.http.get<Respuesta<any[]>>(`${Const.API_CENTRO_ARBITRAJE}/api/pide/get-data-persona-juridica-by-ruc/${numeroDocumento}`);
  }

}
