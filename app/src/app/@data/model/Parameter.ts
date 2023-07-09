import { GenericModel } from "./generic-model";

export class Parameter  extends GenericModel{
  parametroId?: number;
  concepto?: string;
  detalle?: string;
  estado?: number;
  valor?: string;
}
