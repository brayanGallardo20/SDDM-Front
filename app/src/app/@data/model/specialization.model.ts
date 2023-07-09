import { GenericModel } from "./generic-model";

export interface SpecializationModel  extends GenericModel {
    especializacionId?: number;
    nombre?: string;
}