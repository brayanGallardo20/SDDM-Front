import { GenericModel } from "./generic-model";

export interface DocumentType extends GenericModel {
    tipoDocumentoId?: number;
    nombre?: string;
    pide?: number;
    pideCheckBox?: boolean;
    tipoValor?: string;
    mensaje?: string;
    formato?: any;
    numeroCaracteres?: number;
  } 