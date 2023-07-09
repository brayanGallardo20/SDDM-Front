import { Observable } from 'rxjs';
import { Respuesta } from './../model/respuesta';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Tabla } from '../model/tabla';

@Injectable({
  providedIn: 'root'
})
export class TablaService {

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/tabla`;

  constructor(protected readonly http: HttpClient) { }

  listar(): Observable<Respuesta<Tabla[]>> {
    return this.http.get<Respuesta<Tabla[]>>(`${this.host}`);
  }
}
