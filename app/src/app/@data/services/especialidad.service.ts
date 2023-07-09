import { Observable } from 'rxjs';
import { Respuesta } from './../model/respuesta';
import { Especialidad } from './../model/especialidad';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/especialidad`;

  constructor(protected readonly http: HttpClient) { }

  list(): Observable<Respuesta<Especialidad[]>> {
    return this.http.get<Respuesta<Especialidad[]>>(`${this.host}/list`);
  }

  listChoose(): Observable<Respuesta<Especialidad[]>> {
    return this.http.get<Respuesta<Especialidad[]>>(`${this.host}/list-choose`);
  }
}
