import { User } from "../../@data/model/user";
import { Observable } from "rxjs";
import { TypeParameter } from "src/app/@data/model/typeParameter";


export abstract class TypeParameterRepository {

  abstract list(body:any): Observable<any[]>;
  abstract listAll(): Observable<any[]>;
  abstract insert(body:any);
  abstract update(body:TypeParameter);
  abstract delete(id:any);

}
