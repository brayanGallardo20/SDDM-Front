import { GenericBusquedaRequest } from './generic-busqueda-request';
export class FeeBusquedaRequest extends GenericBusquedaRequest {
   
    institucionId:number;
    servicio:string;
}