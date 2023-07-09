import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Sede } from '../model/sede';
import { Respuesta } from '../model/respuesta';
import { ListRange } from '@angular/cdk/collections';
import { SedeBusquedaRequest } from '../model/request/sede-busqueda-request';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/sede`;
  
  constructor(protected readonly http: HttpClient
    ) { 
    }

    listPaginated(request:SedeBusquedaRequest): Observable<Respuesta<Sede[]>>{
      return this.http.post<Respuesta<Sede[]>>(`${this.host}/list-paginated`,request);
    }

    findById(id:number): Observable<Respuesta<Sede>>{
      return this.http.get<Respuesta<Sede>>(`${this.host}/${id}`);
    }

    save(request: Sede): Observable<Respuesta<Sede>> {
      return this.http.post<Respuesta<Sede>>(`${this.host}`, request)
    }

    update(request: Sede): Observable<Respuesta<Sede>> {
      return this.http.put<Respuesta<Sede>>(`${this.host}`, request)
    }

    deleteById(request:Sede): Observable<Respuesta<Sede>>{
      return this.http.post<Respuesta<Sede>>(`${this.host}/deleteById`,request);
    }
}
