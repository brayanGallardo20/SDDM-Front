import { GenericBusquedaRequest } from "./generic-busqueda-request";

export class AuditoriaBusquedaRequest extends GenericBusquedaRequest{ 
    tabla!:string;
    auditTipo!:string;
    auditFechaInicio!:string;
    auditFechaFin!:string;
    usuario!:string;
}