import { GenericModel } from "./generic-model";

export interface EtapaArbitralModel  extends GenericModel {
    etapaArbitralId?: number;
    nombre?: string;
    orden?: number;
}