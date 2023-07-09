import { GenericModel } from './generic-model';
export class Arbitro extends GenericModel{
    arbitroId!:number;
    especialidadId!:number;
    tipoDocumentoId!:number;
    declaracionInteresId!:number;
    sancionId!:number;
    ubigeoId!:number;
    apellidoPaterno!:string;
    apellidoMaterno!:string;
    nombre!:string;
    experienciaArbitraje!:string;
    tipo!:string;

     especialidadNombre!:string;
     tipoDocumentoNombre!:string;
     declaracionInteresNombre!:string;
     sancionNombre!:string;
}