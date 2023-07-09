import { User } from "../../@data/model/user";
import { Observable } from "rxjs";
import { Parameter } from "src/app/@data/model/Parameter";
import { Respuesta } from "src/app/@data/model/respuesta";


export abstract class InstitutionRepository {
  
  abstract listAll(body:any):  Observable<Respuesta<any[]>>;
  abstract findIntitutionPersona(institucionId:any):  Observable<Respuesta<any[]>>;

}
