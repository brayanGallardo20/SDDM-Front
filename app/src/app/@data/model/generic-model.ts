import { Utils } from "src/app/util/utils";

export class GenericModel{ 
    auditUsuarioCreacion?:string = Utils.obtenerNombreUser();
    auditFechaCreacion?:Date;
    auditUsuarioModifica?:string  =  Utils.obtenerNombreUser();
    auditFechaModifica?:Date;
    auditFechaCreacionFormat?:string;
    auditFechaModificaFormat?:string;
}