import { DirectivoBusquedaRequest } from './../model/request/directivo-busqueda-request';
import { Observable } from 'rxjs';
import { Directivo } from './../model/directivo';
import { Respuesta } from './../model/respuesta';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DirectivoService {

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/directivo`;

  constructor(protected readonly http: HttpClient) { }

  listBusqueda(request: DirectivoBusquedaRequest): Observable<Respuesta<Directivo[]>> {
    return this.http.post<Respuesta<Directivo[]>>(`${this.host}/list-busqueda`, request);
  }

  insert(request: Directivo): Observable<Respuesta<Directivo>> {
    return this.http.post<Respuesta<Directivo>>(`${this.host}/insert`, request);
  }

  update(request: Directivo): Observable<Respuesta<Directivo>> {
    return this.http.post<Respuesta<Directivo>>(`${this.host}/update`, request);
  }

  findById(request: Directivo): Observable<Respuesta<Directivo>> {
    return this.http.post<Respuesta<Directivo>>(`${this.host}/findById`, request);
  }

  deleteById(request: Directivo): Observable<Respuesta<Directivo>> {
    return this.http.post<Respuesta<Directivo>>(`${this.host}/delete`, request);
  }

}
