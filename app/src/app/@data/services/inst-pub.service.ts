import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Const } from './const';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstPubService {

   private institucionId: Subject<number> = new Subject<number>();

  constructor(
    private http: HttpClient
  ) { }

  save(data: any) {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/institution/insert`;
    return this.http.post(url, data);
  }

  update(data: any) {
    const url = `${Const.API_CENTRO_ARBITRAJE}/api/institution/update`;
    return this.http.put(url, data);
  }


  getInstitucionId():Observable<number>{
    return this.institucionId.asObservable();
  } 

  setInstitucionId(institucionId: number) {
    this.institucionId.next(institucionId)
  } 
}
