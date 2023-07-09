import { User } from "../../@data/model/user";
import { Observable } from "rxjs";


export abstract class MenuRepository {

  abstract onMenuStateChange(key: string);
  abstract reset();

}
