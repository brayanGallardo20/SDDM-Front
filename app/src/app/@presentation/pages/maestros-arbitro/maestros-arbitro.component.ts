import { ArbitroRegistrarActualizarComponent } from './arbitro-registrar-actualizar/arbitro-registrar-actualizar.component';
import { ArbitroBusquedaRequest } from './../../../@data/model/request/arbitro-busqueda-request';
import { ArbitroService } from './../../../@data/services/arbitro.service';
import { Arbitro } from './../../../@data/model/arbitro';
import { SubscriptionLike } from 'subsink/dist/subsink';
import { FunctionHelpers } from './../../shared/helper/function-helpers';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Constants } from './../../shared/helper/constants';
import { Respuesta } from './../../../@data/model/respuesta';
import { SubSink } from 'subsink';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-maestros-arbitro',
  templateUrl: './maestros-arbitro.component.html',
  styleUrls: ['./maestros-arbitro.component.scss']
})
export class MaestrosArbitroComponent implements OnInit,OnDestroy {

  private readonly subSink = new SubSink();

  listadoArbitro:Arbitro[]=[];
  respuesta: Respuesta<Arbitro[]> = new Respuesta();

  cantidadPorPagina: number =  Constants.cantidadPorPagina;
  loading: boolean;

  nombreCompleto!:string; 
  usuarioRegistro!:string;
  fechaRegistro!:Date;
  usuarioModifica!:string;
  fechaModifica!:Date;

  dynamicDialogRegistrarActualizar!: DynamicDialogRef;

  constructor(
    private readonly arbitroService:ArbitroService,
    private readonly messageService: MessageService ,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
  ) { 


  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  buscar(first?:number){
    let requestBusqueda:ArbitroBusquedaRequest = new ArbitroBusquedaRequest();
    requestBusqueda.nombreCompleto = this.nombreCompleto; 
    requestBusqueda.auditUsuarioCreacion = this.usuarioRegistro;
    requestBusqueda.auditFechaCreacion =  (this.fechaRegistro != null && this.fechaRegistro !== undefined) ? FunctionHelpers.formatDateToString(this.fechaRegistro, 'yyyy-mm-dd') : null;
    requestBusqueda.auditUsuarioModifica = this.usuarioModifica;
    requestBusqueda.auditFechaModifica =  (this.fechaModifica != null && this.fechaModifica !== undefined) ? FunctionHelpers.formatDateToString(this.fechaModifica, 'yyyy-mm-dd') : null;
    requestBusqueda.cantidadPorPagina =this.cantidadPorPagina;
    if (first) requestBusqueda.filaInicio = first 
    this.subSink.add(this.listarArbitros(requestBusqueda))
  }

  limpiar(){
    this.nombreCompleto=null;
    this.usuarioRegistro =null;
    this.fechaRegistro = null;
    this.usuarioModifica = null;
    this.fechaModifica = null;
  }

  
  cargarArbitros(event) {
    this.buscar(event.first) 
  }

  listarArbitros(requestBusqueda:ArbitroBusquedaRequest):SubscriptionLike{
    this.loading = true
    let subl: SubscriptionLike =
      this.arbitroService.listBusqueda(requestBusqueda)
        .subscribe({
          next: (res) => {
            this.respuesta = res;
            this.loading = false
          },
          error: (error: any) => {
            if (error.status === 0) {
              this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Se perdió conexión con el servidor` });
            } else {
              if (error.status === 400) {
                this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
              } else if (error.status === 500) {
                this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.statusText}` });
              } 
            }
          },
        });
    return subl;
  }

 

  evaluarRegistrarActualizar(directivo:Arbitro,readOnly:boolean){
    let data: Arbitro =directivo; 
    if(data.arbitroId==null){ 
      this.abrirModalAgregarActualizar(data,readOnly);
    }else{
      this.subSink.add(
        this.arbitroService.findById(directivo)
        .subscribe({
          next: (res) => {
            data = res.data; 
            if(readOnly){
              this.abrirModalAgregarActualizar(data,true);
            }else{
              this.abrirModalAgregarActualizar(data,false);
            }
           
          },
          error: (error: any) => {
            if (error.status === 0) {
              this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Se perdió conexión con el servidor` });
            } else {
              if (error.status === 400) {
                this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
              } else if (error.status === 500) {
                this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.statusText}` });
              } 
            }
          },
        }) 
      )
    }  
  }


  abrirModalAgregarActualizar(arbitro:Arbitro,readOnly:boolean){
    let data:any = {};
    data.arbitro =arbitro;
    data.readOnly = readOnly;
    this.dynamicDialogRegistrarActualizar = this.dialogService.open(ArbitroRegistrarActualizarComponent, {
      data: data,
      header: 'Arbitros: Registrar - Actualizar ',
      width: '60%',
      height: '60%',
      contentStyle: { "overflow": "auto" },
      baseZIndex: 10000, 
      closable: true,
      maximizable:true
    });

    this.dynamicDialogRegistrarActualizar.onClose.subscribe((value: any) => {
      if(value){
        if(value.result==='OK'){
          this.messageService.add({ key: 'toast',severity: 'success', summary: 'Correcto', detail: `${value.mensaje}`,life:5000});
        this.buscar();
        }else{
          this.messageService.add({ key: 'toast',severity: 'error', summary: 'Error', detail: `${value.mensaje}`});
        }  
      } 
    });
  }


  
  abrirConfirmacionEliminar(directivo:Arbitro){
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          
            this.eliminar(directivo);
      },
      reject: (type: any) => {
      }
    });
  }

  eliminar(directivo:Arbitro){
    this.subSink.add(
      this.arbitroService.deleteById(directivo)
      .subscribe({
        next: (res) => {
            this.messageService.add({ key: 'toast',severity: 'success', summary: 'Correcto', detail: `${res.mensaje}`,life:5000});
            this.buscar();
        },
        error: (error: any) => {
          if (error.status === 0) {
            this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Se perdió conexión con el servidor` });
          } else {
            if (error.status === 400) {
              this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
            } else if (error.status === 500) {
              this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.statusText}` });
            } 
          }
        },
      })  
    )
  }

  cerrarModalConfirmacion(){
    this.confirmationService.close();
  }

}
