import { Observable } from 'rxjs';
import { Respuesta } from './../model/respuesta';
import { Ubigeo } from './../model/ubigeo';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/ubigeo`;

  constructor(protected readonly http: HttpClient) { }


  listDepartamento(): Observable<Respuesta<Ubigeo[]>> {
    return this.http.get<Respuesta<Ubigeo[]>>(`${this.host}`);
  }
 
  listProvincia(codDepartamento:string): Observable<Respuesta<Ubigeo[]>> {
    return this.http.get<Respuesta<Ubigeo[]>>(`${this.host}/${codDepartamento}`);
  }

  listDistrito(codDepartamento:string,codProvincia:string): Observable<Respuesta<Ubigeo[]>> {
    return this.http.get<Respuesta<Ubigeo[]>>(`${this.host}/${codDepartamento}/${codProvincia}`);

 }
  obtenerUbigeoPorId(tipo:string,idUbigeo:number): Observable<Respuesta<Ubigeo>> {
    return this.http.get<Respuesta<Ubigeo>>(`${this.host}/${tipo}/por-id/${idUbigeo}`);

  }


  getDepartamento(): Observable<Respuesta<Ubigeo[]>> {
    return this.http.get<Respuesta<Ubigeo[]>>(`${this.host}`);
  }

  getProvincia(codDepartamento:string): Observable<Respuesta<Ubigeo[]>> {
    return this.http.get<Respuesta<Ubigeo[]>>(`${this.host}/${codDepartamento}`);
  }

  getDistrito(codDepartamento:string,codProvincia:string): Observable<Respuesta<Ubigeo[]>> {
    return this.http.get<Respuesta<Ubigeo[]>>(`${this.host}/${codDepartamento}/${codProvincia}`);
  }


}
