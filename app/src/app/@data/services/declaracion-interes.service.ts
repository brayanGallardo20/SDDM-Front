import { DeclaracionInteres } from './../model/declaracion-interes';
import { Respuesta } from './../model/respuesta';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment.prod';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeclaracionInteresService {

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/declaracion-interes`;

  constructor(protected readonly http: HttpClient) { }

  list(): Observable<Respuesta<DeclaracionInteres[]>> {
    return this.http.get<Respuesta<DeclaracionInteres[]>>(`${this.host}/list`);
  }
}
