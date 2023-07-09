import { Observable } from 'rxjs';
import { Respuesta } from './../model/respuesta';
import { Sancion } from './../model/sancion';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SancionService {

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/sancion`;

  constructor(protected readonly http: HttpClient) { }

  list(): Observable<Respuesta<Sancion[]>> {
    return this.http.get<Respuesta<Sancion[]>>(`${this.host}/list`);
  }
}
