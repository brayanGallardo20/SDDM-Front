import { User } from "../../@data/model/user";
import { Observable } from "rxjs";
import { Parameter } from "src/app/@data/model/Parameter";
import { Respuesta } from "src/app/@data/model/respuesta";


export abstract class SpecialtyRepository {
  
  abstract listAll(body:any):  Observable<Respuesta<any[]>>;
  abstract update(body:any): Observable<any>;
  abstract save(body:any): Observable<any>;
  abstract delete(id:any): Observable<any>;

}
