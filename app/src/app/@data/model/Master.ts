import { GenericModel } from "./generic-model";

export class Master  extends GenericModel  {
  maestraId?: number;
  tablaMaestra?: string;
  nombre?: string;
  estado?: number;
}