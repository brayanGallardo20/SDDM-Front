import { User } from "../../@data/model/user";
import { Observable } from "rxjs";
import { Respuesta } from "src/app/@data/model/respuesta";

export abstract class DutyRepository {

  abstract listAll(request:any):  Observable<Respuesta<any[]>>
  abstract insert(body:any);
  abstract update(body:any);
  abstract delete(nombreTabla:any,id:any);

}
