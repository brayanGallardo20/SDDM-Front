import { User } from "../../@data/model/user";
import { Observable } from "rxjs";
import { Parameter } from "src/app/@data/model/Parameter";
import { Respuesta } from "src/app/@data/model/respuesta";


export abstract class ParameterRepository {

  abstract listAll(request:any): Observable<Respuesta<any[]>>
  abstract insert(body:any);
  abstract update(body:Parameter);
  abstract delete(data: any);
 
}
