import { Arbitro } from './../model/arbitro';
import { Respuesta } from './../model/respuesta';
import { Observable } from 'rxjs';
import { ArbitroBusquedaRequest } from './../model/request/arbitro-busqueda-request';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArbitroService {


  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/arbitro`;

  constructor(protected readonly http: HttpClient) { }

  listBusqueda(request: ArbitroBusquedaRequest): Observable<Respuesta<Arbitro[]>> {
    return this.http.post<Respuesta<Arbitro[]>>(`${this.host}/list-busqueda`, request);
  }

  insert(request: Arbitro): Observable<Respuesta<Arbitro>> {
    return this.http.post<Respuesta<Arbitro>>(`${this.host}/insert`, request);
  }

  update(request: Arbitro): Observable<Respuesta<Arbitro>> {
    return this.http.post<Respuesta<Arbitro>>(`${this.host}/update`, request);
  }

  findById(request: Arbitro): Observable<Respuesta<Arbitro>> {
    return this.http.post<Respuesta<Arbitro>>(`${this.host}/findById`, request);
  }

  deleteById(request: Arbitro): Observable<Respuesta<Arbitro>> {
    return this.http.post<Respuesta<Arbitro>>(`${this.host}/deleteById`, request);
  }

}
