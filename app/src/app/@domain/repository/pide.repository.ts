import { Observable } from "rxjs";
import { Respuesta } from "src/app/@data/model/respuesta";

export abstract class PideRepository {

  abstract findNaturalPerson(numeroDocumento:string): Observable<Respuesta<any[]>>;
  abstract findLegalPerson(numeroDocumento:string): Observable<Respuesta<any[]>>;


}
