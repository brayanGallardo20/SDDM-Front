import { GenericModel } from "./generic-model";

export interface ArbitrationMatterModel  extends GenericModel {
    materiaArbitralId?: number;
    nombre?: string;

    isDisabled?:boolean;
}