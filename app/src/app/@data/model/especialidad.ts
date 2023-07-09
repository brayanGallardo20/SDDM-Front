import { GenericModel } from './generic-model';
export class Especialidad extends GenericModel {

    especialidadId!:number;
    nombre!:string;


    //atributo de ayuda
    isDisabled:boolean;

}