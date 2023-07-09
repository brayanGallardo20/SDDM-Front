import { GenericModel } from './generic-model';
export class Directivo extends GenericModel {
    personaNaturalId:number;
    institucionPersonaId:number;
    institucionId:number;
    tipoDocumentoId:number;
    nombre:string;
    apellidoPaterno:string;
    apellidoMaterno:string;
    numeroDocumento:string;
    telefono:string;
    email:string;
    direccion:string;
}