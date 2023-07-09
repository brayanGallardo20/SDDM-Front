import { GenericBusquedaRequest } from './generic-busqueda-request';
export class InstitucionBusquedaRequest extends GenericBusquedaRequest {
   
    razonSocial!:string;
    ruc!:string;
    tipoOperadorArbitralId!:number;

} 