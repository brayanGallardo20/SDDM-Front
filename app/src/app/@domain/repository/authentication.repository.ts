import { User } from "../../@data/model/user";
import { Observable } from "rxjs";


export abstract class AuthenticationRepository {

  abstract get getCurrentUserValue(): User;
  // abstract login(login: string, clave: string): Observable<any>;
  abstract logout(): void;
  abstract clearUser();

}
