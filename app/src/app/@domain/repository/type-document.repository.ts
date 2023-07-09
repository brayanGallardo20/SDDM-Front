import { User } from "../../@data/model/user";
import { Observable } from "rxjs";
import { TypeParameter } from "src/app/@data/model/typeParameter";
import { Respuesta } from "src/app/@data/model/respuesta";
import { TypeDocumentBusquedaRequest } from "src/app/@data/model/request/type-document-busqueda-request";


export abstract class TypeDocumentRepository {

  abstract listAll(request:TypeDocumentBusquedaRequest): Observable<Respuesta<any[]>>;
  abstract insert(body:any);
  abstract update(body:TypeParameter);
  abstract delete(requestBusqueda:any);

}
