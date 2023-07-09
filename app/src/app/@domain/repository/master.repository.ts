import { User } from "../../@data/model/user";
import { Observable } from "rxjs";
import { TypeParameter } from "src/app/@data/model/typeParameter";
import { MasterBusquedaRequest } from "src/app/@data/model/request/master-busqueda-request";
import { Respuesta } from "src/app/@data/model/respuesta";


export abstract class MasterRepository {

  abstract listAll(request:MasterBusquedaRequest): Observable<Respuesta<any[]>>;
  abstract insert(body:any);
  abstract update(body:TypeParameter);
  abstract delete(nombreTabla:any,id:any);

}
