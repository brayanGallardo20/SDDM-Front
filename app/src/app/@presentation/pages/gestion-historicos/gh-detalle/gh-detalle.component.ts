import { Auditoria } from './../../../../@data/model/auditoria';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnInit } from '@angular/core';
import { opciones } from 'src/app/util/utils';

@Component({
  selector: 'app-gh-detalle',
  templateUrl: './gh-detalle.component.html',
  styleUrls: ['./gh-detalle.component.scss']
})
export class GhDetalleComponent implements OnInit {

  auditoriaDetalle:Auditoria

  readOnly:boolean = true;

  valorOriginal:any;
  valorFinal:any;

  formatDate: string = '';


  keysValorOriginal:string[]=[];
  keysValorFinall:string[]=[];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    this.auditoriaDetalle = this.config.data.auditoria
    this.valorOriginal= (this.auditoriaDetalle.valorOriginal) ? JSON.parse(this.auditoriaDetalle.valorOriginal.replace(/NULL/g, "null")):{}
    this.valorFinal = (this.auditoriaDetalle.valorFinal)  ? JSON.parse(this.auditoriaDetalle.valorFinal.replace(/NULL/g, "null")):{}

   if (this.auditoriaDetalle.valorOriginal){
    this.keysValorOriginal = Object.keys(this.valorOriginal);
    this.formatDate = this.auditoriaDetalle.auditFechaCompletaFormat ? new Date(this.auditoriaDetalle.auditFechaCompletaFormat).toLocaleString('es-ES', opciones).replace(",",""): '';
    this.keysValorOriginal = this.keysValorOriginal.filter((key)=> key != 'AUDITFECHACREACIONFORMAT' && key != 'AUDITFECHAMODIFICAFORMAT');
    this.keysValorOriginal.forEach((key) => {
      if(key == 'AUDITFECHACREACION') {
          if(this.valorOriginal[key]){
            const fechaCreaOriginal = new Date(this.valorOriginal[key]);
            this.valorOriginal[key] = fechaCreaOriginal.toLocaleString('es-ES', opciones).replace(",","");
          }else{
            this.valorOriginal[key] = '';
          } 
      }
      if(key == 'AUDITFECHAMODIFICA' && this.valorOriginal[key] != null) {
        const fechaModificaOriginal = new Date(this.valorOriginal[key]);
        this.valorOriginal[key] = fechaModificaOriginal.toLocaleString('es-ES', opciones).replace(",","");
      }
      if(key == 'AUDITUSUARIOMODIFICA' && this.valorOriginal[key] === null) {
        this.valorOriginal[key] = 'null';
      }
      if(key == 'AUDITFECHAMODIFICA' && this.valorOriginal[key] === null) {
        this.valorOriginal[key] = 'null';
      }
    });
  }

    if (this.auditoriaDetalle.valorFinal){
      this.keysValorFinall = Object.keys(this.valorFinal);
      this.formatDate = this.auditoriaDetalle.auditFechaCompletaFormat ? new Date(this.auditoriaDetalle.auditFechaCompletaFormat).toLocaleString('es-ES', opciones).replace(",",""): '';
      this.keysValorFinall = this.keysValorFinall.filter((key)=> key != 'AUDITFECHACREACIONFORMAT' && key != 'AUDITFECHAMODIFICAFORMAT');
      this.keysValorFinall.forEach((key) => {
        if(key == 'AUDITFECHACREACION') {
     
          if(this.valorFinal[key]){
            const fechaCreaFinal = new Date(this.valorFinal[key]);
          this.valorFinal[key] = fechaCreaFinal.toLocaleString('es-ES', opciones).replace(",","");

          }else{
            this.valorFinal[key] = '';
          } 
        }
        if(key == 'AUDITFECHAMODIFICA' && this.valorFinal[key] != null) {
          const fechaModificaFinal = new Date(this.valorFinal[key]);
          this.valorFinal[key] = fechaModificaFinal.toLocaleString('es-ES', opciones).replace(",","");
        }
        if(key == 'AUDITUSUARIOMODIFICA' && this.valorFinal[key] === null) {
          this.valorFinal[key] = 'null';
        }
        if(key == 'AUDITFECHAMODIFICA' && this.valorFinal[key] === null) {
          this.valorFinal[key] = 'null';
        }
      });
    }
  }

  close(): void {
    this.ref.close();
  }
}
