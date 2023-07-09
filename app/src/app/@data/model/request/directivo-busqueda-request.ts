import { GenericBusquedaRequest } from './generic-busqueda-request';
export class DirectivoBusquedaRequest extends GenericBusquedaRequest{
    institucionId:number;
    numeroDocumento:string;
    tipoDocumentoId:number;
    auditUsuarioCreacion:string;
    auditFechaCreacion:string;
    auditUsuarioModifica:string;
    auditFechaModifica:string;
}