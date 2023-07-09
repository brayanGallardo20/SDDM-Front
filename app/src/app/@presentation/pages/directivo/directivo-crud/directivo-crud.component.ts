import { style } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { DirectivoBusquedaRequest } from 'src/app/@data/model/request/directivo-busqueda-request';
import { Respuesta } from 'src/app/@data/model/respuesta';
import { Directivo } from 'src/app/@data/model/directivo';
import { DocumentType } from "src/app/@data/model/tipo-doc";
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';
import { DirectivoService } from 'src/app/@data/services/directivo.service';
import { TypeDocumentService } from "src/app/@data/services/type-document.service";
import { Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { SubscriptionLike } from 'subsink/dist/subsink';
import { DirectivoRegistrarActualizarComponent } from '../directivo-registrar-actualizar/directivo-registrar-actualizar.component';
import { NumberSymbol } from '@angular/common';

@Component({
  selector: 'app-directivo-crud',
  templateUrl: './directivo-crud.component.html',
  styleUrls: ['./directivo-crud.component.scss']
})
export class DirectivoCrudComponent implements OnInit {

  @Input() institucionId:number;
  //@Input() institucionId:number = 1;
  tipoDocumentoId:number;
  numeroDocumento:string;
  tipoDocumentoSeleccionado: any;

  private readonly subSink = new SubSink();
  configuraciones: Configuracion;

  dynamicDialogRegistrarActualizar!: DynamicDialogRef;
  first: number = 0;
  last: number = 0;
  cantidadPorPagina: number;
  loading: boolean;   

  listadoDirectivo: Directivo[] = [];
  respuesta: Respuesta<Directivo[]> = new Respuesta();
  optionsPaginated: number[] = Utils.optionsPaginated;
  tiposDoc: DocumentType[];

  constructor(
    private readonly directivoService:DirectivoService, 
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService, 
    private readonly configuracionService: ConfiguracionService,
    private readonly typeDocumentService: TypeDocumentService,
    private readonly confirmationService:ConfirmationService
  ) { }

  ngOnInit(): void {
    this.configuraciones = this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila
    this.buscar(null, 1);

    this.listTypeDocument();
  }

  listTypeDocument() {
    this.typeDocumentService.listAllView().subscribe({
      next: (res) => {
        this.tiposDoc = res.data;
      },
      error: (error: any) => {},
    });
  }

  buscar(event?: any, tipoCarga?: number) {
    if (tipoCarga === 2) {
      this.validarBuscar();
      if (!this.validarBuscar()) {
        this.messageService.add({ key: 'toast', severity: 'warn', summary: `Atención`, detail: 'Ingresar por lo menos un filtro de búsqueda' });
        return;
      }
    }

    let busquedaRequest: DirectivoBusquedaRequest = new DirectivoBusquedaRequest();
    busquedaRequest.institucionId = this.institucionId;
    busquedaRequest.numeroDocumento = this.numeroDocumento ? this.numeroDocumento.trim() : '';
    console.log("MARCOS");
    console.log(this.tipoDocumentoSeleccionado);
    busquedaRequest.tipoDocumentoId = (this.tipoDocumentoSeleccionado) ? this.tipoDocumentoSeleccionado.tipoDocumentoId : null;
    if (event) {
      if (event.rows !== undefined) this.cantidadPorPagina = event.rows;
      if (event.first !== undefined) this.first = event.first;
    }
    busquedaRequest.cantidadPorPagina = this.cantidadPorPagina;
    busquedaRequest.filaInicio = this.first
    this.subSink.add(this.listarDirectivo(busquedaRequest))
  }

  validarBuscar(): boolean {
    if (this.numeroDocumento === undefined && this.tipoDocumentoSeleccionado === undefined
    ) {
      return false;
    }
    return true;
  }

  listarDirectivo(request: DirectivoBusquedaRequest): SubscriptionLike {
    this.loading = true
    console.log(request)
    let subl: SubscriptionLike =
      this.directivoService.listBusqueda(request)
        .subscribe({          
          next: (res) => {
            console.log("Busquedaxx: ") 
            console.log(res) 
            this.respuesta = res;
            this.loading = false

          },
          error: (error: any) => {
          },
        });
    return subl;
  }

  cargarDirectivo(event): void { 
      this.buscar(event, 1) 
  }

  limpiar() {
    this.numeroDocumento = undefined;
    this.tipoDocumentoSeleccionado = undefined;
    this.buscar(null, 1)
  }

  abrirModalRegistrarActualizar(directivo: Directivo,readOnly:boolean) {
    let data: any = {};
    data.directivo = directivo;
    data.readOnly = readOnly;
    data.institucionId = this.institucionId;

   let headerLabel = '';
    if(readOnly){
      headerLabel = 'Ver Registro'
    } else {
      headerLabel= (!directivo)?'Nuevo Registro':'Editar Registro'
    }

    this.dynamicDialogRegistrarActualizar = this.dialogService.open(DirectivoRegistrarActualizarComponent, {
      data: data,
      header: headerLabel,
      width: '850px',
      height: '400px',
      contentStyle: { "overflow": "auto" }, 
      closable: true,
      maximizable: false
    });

    this.dynamicDialogRegistrarActualizar.onClose.subscribe((value: any) => {
      if(value){ 
          this.messageService.add({ key: 'toast',severity: 'success', summary: 'Exitoso', detail: `${value.mensaje}`,life:5000});
          this.buscar(); 
        }
      }
    );
  }

  
  evaluarRegistrarActualizar(directivo:Directivo,readOnly:boolean){
    let data: Directivo = directivo; 
    if(data.institucionPersonaId == undefined){  
      this.abrirModalRegistrarActualizar(null,readOnly);
    } else {
      this.subSink.add(
        this.directivoService.findById(directivo)
        .subscribe({
          next: (res) => {
            data = res.data; 
            if(readOnly){
              this.abrirModalRegistrarActualizar(data,true);
            }else{
              this.abrirModalRegistrarActualizar(data,false);
            }           
          },
          error: (error: any) => {
          },
        }) 
      )
    }  
  }

  directivoDelete:Directivo;
  dialogDeleteVisible:boolean=false;

  closeModalDelete() {
    this.dialogDeleteVisible = false;
  }

  abrirConfirmacionEliminar(directivo:Directivo){
      this.directivoDelete = directivo;
      this.dialogDeleteVisible = true;
  }

  deleteById(){
    if(this.directivoDelete){
      this.directivoDelete.auditUsuarioModifica =  Utils.obtenerNombreUser()
      this.subSink.add(
        this.directivoService.deleteById(this.directivoDelete)
        .subscribe({
          next: (res) => {
              //this.messageService.add({ key: 'toast',severity: 'success', summary: 'Exitoso', detail: `${res.mensaje}`,life:5000});
              this.buscar();
              this.dialogDeleteVisible = false;
          },
          error: (error: any) => {
          },
        })  
      )
    } 
  }
 

}
