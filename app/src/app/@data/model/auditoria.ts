export class Auditoria{
    tabla!:string;
    codigo!:string;
    movimiento:number;
    auditUsuario!:string;
    auditFecha!:string;
    auditTipo!:string;
    valorOriginal!:string;
    valorFinal!:string;

    auditFechaFormat!:string;
    auditFechaCompletaFormat!:string;

    auditTipoDesc!:string;
}