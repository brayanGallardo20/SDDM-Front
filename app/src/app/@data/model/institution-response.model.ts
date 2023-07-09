import { GenericModel } from './generic-model';

export interface InstitutionResponse extends GenericModel {
    institucionId?: number;
    tipoOperadorArbitralId?: number;
    ubigeoId?: string;
    ruc?: string;
    razonSocial?: string;
    entidadPromotora?: number;
    horarioAtencion?: string;
    direccion?: string;
    telefono?: string;
    correo?: string;
    paginaWeb?: string;
    horarioLvInicio?: string;
    horarioLvFin?: string;
    horarioSaInicio?: string;
    horarioSaFin?: string;
    activo?: string;

  }