import { TipoDocumento } from './../model/tipo-documento';
import { Respuesta } from './../model/respuesta';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {


  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/tipo-documento`;

  constructor(protected readonly http: HttpClient) { }

  list(): Observable<Respuesta<TipoDocumento[]>> {
    return this.http.get<Respuesta<TipoDocumento[]>>(`${this.host}/list`);
  }
}
