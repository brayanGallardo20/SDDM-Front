import { GenericModel } from "./generic-model";

export interface SpecialtyModel  extends GenericModel {
    especialidadId?: number;
    nombre?: string;
}