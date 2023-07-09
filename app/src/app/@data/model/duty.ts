import { GenericModel } from './generic-model';
export class Duty  extends GenericModel{
 
    arancelId?:number;
    institucionId?:number;
    cuantia?:string;
    honorarioArbitro?:string;
    honorarioPagarParte?:string;
    activo?:string;

}