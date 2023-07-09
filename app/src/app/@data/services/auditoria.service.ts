import { AuditoriaBusquedaRequest } from 'src/app/@data/model/request/auditoria-busqueda-request';
import { Auditoria } from './../model/auditoria';
import { Respuesta } from './../model/respuesta';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/auditoria`;

  constructor(protected readonly http: HttpClient) { }

  listBusqueda(request: AuditoriaBusquedaRequest): Observable<Respuesta<Auditoria[]>> {
    return this.http.post<Respuesta<Auditoria[]>>(`${this.host}/list-paginated`, request);
  }

}
