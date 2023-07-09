import { GenericModel } from "./generic-model";

export class TypeParameter extends GenericModel{
  tipoParametroId?: number;
  nombre?: string;
  descripcion?: string;
  activo?: number;
}
