export interface InfoInstPubModel{
    tipoOperadorArbitralId?: number;
    ruc?: string;
    nombre?: string;
    entidadPromotora?: string;
    horarioAtencion?: string;
    direccion?: string;
    telefono?: string;
    correo?: string;
    nombreRepresentante?: string;
    ubigeoId?: string;
    activo?: number;
    auditUsuarioCreacion?:string;
    auditUsuarioModifica?:string;
    auditFechaCreacionFormat?:string;
    auditFechaModificaFormat?:string;
}