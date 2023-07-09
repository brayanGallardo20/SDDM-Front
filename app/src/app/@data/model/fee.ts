import { GenericModel } from './generic-model';
export class Fee  extends GenericModel {

    tarifaId?:number;
    institucionId?:number;
    servicio?:string;
    requisito?:string;
    derechoPagoUit?:string;
    plazoAtencion?:string;
    activo?:string;
}