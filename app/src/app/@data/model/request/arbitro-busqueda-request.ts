import { GenericBusquedaRequest } from './generic-busqueda-request';
export class ArbitroBusquedaRequest extends GenericBusquedaRequest{
    especialidadId!:number;
    tipoDocumentoId!:number;
    declaracionInteresId!:number;
    sancionId!:number;
    nombreCompleto!:string;
    auditUsuarioCreacion!:string;
    auditFechaCreacion!:string;
    auditUsuarioModifica!:string;
    auditFechaModifica!:string;
}