import { GenericModel } from "./generic-model";

export interface DutyResponse extends GenericModel {
  arancelId?: number;
  institucionId?: number;
  cuantia?: string;
  honorarioArbitro?: string;
  honorarioPagarParte?: number;
  activo?: string;
}
