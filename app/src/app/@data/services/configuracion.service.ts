import { Configuracion } from './../model/configuracion';
import { Observable, Subject, map } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Respuesta } from '../model/respuesta';
import { HttpClient  } from '@angular/common/http'; 
import { SubSink } from 'subsink';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService implements OnDestroy {

  private readonly subSink = new SubSink();

  configuracionLoad: Observable<Respuesta<Configuracion>> = new Subject<Respuesta<Configuracion>>();
  configLoad: Subject<Configuracion> = new Subject<Configuracion>();
  configuracion:Configuracion;

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/configuracion`;

  constructor(protected readonly http: HttpClient
  ) { 
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  loadConfig():Observable<Configuracion>{
    return this.getConfigDefault().pipe(
      map(config => {
        this.configuracion = config.data;
        return config.data;
      })
    );
  } 

  loadConfigReload(){ 
    this.subSink.add(
      this.loadConfig().subscribe({
        next: (res) => {
            console.log("Configuracion cargada")
          },
          error: (error: any) => {
            console.log("Error al cargar configuracion")
          },
        })
    ) 
  }

  getConfigDefault(): Observable<Respuesta<Configuracion>> {
    return this.http.get<Respuesta<Configuracion>>(`${this.host}/get-config-default`);
  }

  update(request: Configuracion): Observable<Respuesta<Configuracion>> {
    return this.http.put<Respuesta<Configuracion>>(`${this.host}`, request)
  }

   getConfigLoad(): Observable<Configuracion> {
    return this.configLoad;
  }

  setConfigLoad(menu: any) {
    this.configLoad.next(menu)
  } 
}