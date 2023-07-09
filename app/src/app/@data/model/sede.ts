import { ArbitrationMatterModel } from "./arbitrationMatter.model";
import { Especialidad } from "./especialidad";
import { GenericModel } from "./generic-model"
import { SedeEspecialidad } from "./sede-especialidad";
import { SedeMateriaArbitral } from "./sede-materia-arbitral";
import { Ubigeo } from "./ubigeo";

export class Sede extends GenericModel{
    sedeId: number;
    institucionId: number;
    nombre: string;
    direccion: string;
    numeroResolucionPartida: string;
    telefono: string;
    correo: string;
    ubigeoId:string;
    listadoSedeEspecialidad:SedeEspecialidad[]=[];
    listadoSedeMateriaArbitral:SedeMateriaArbitral[]=[];


    //Variables de apoyo
    departamento:Ubigeo;
    provincia:Ubigeo;
    distrito:Ubigeo;
    especialidadesSeleccionadas:Especialidad[]=[];
    materiaArbitralSeleccionadas:ArbitrationMatterModel[]=[]
}