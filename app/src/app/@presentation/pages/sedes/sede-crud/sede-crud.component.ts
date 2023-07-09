import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { SedeBusquedaRequest } from 'src/app/@data/model/request/sede-busqueda-request';
import { Respuesta } from 'src/app/@data/model/respuesta';
import { Sede } from 'src/app/@data/model/sede';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';
import { SedeService } from 'src/app/@data/services/sede.service';
import { Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { SubscriptionLike } from 'subsink/dist/subsink';
import { SedeRegistrarActualizarComponent } from '../sede-registrar-actualizar/sede-registrar-actualizar.component';
import { ValidatorService } from 'src/app/@data/services/validator.service';

@Component({
  selector: 'app-sede-crud',
  templateUrl: './sede-crud.component.html',
  styleUrls: ['./sede-crud.component.scss']
})
export class SedeCrudComponent implements OnInit {

  @Input() institucionId:number;
  nombre:string;

  private readonly subSink = new SubSink();
  configuraciones: Configuracion;

  dynamicDialogRegistrarActualizar!: DynamicDialogRef;
  first: number = 0;
  last: number = 0;
  cantidadPorPagina: number;
  loading: boolean;   

  listadoSede: Sede[] = [];
  respuesta: Respuesta<Sede[]> = new Respuesta();
  optionsPaginated: number[] = Utils.optionsPaginated;


  constructor(
    private readonly sedeService:SedeService, 
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService, 
    private readonly configuracionService: ConfiguracionService,
    private readonly validatorService:ValidatorService
  ) {
    this.configuraciones = this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila
   }

  ngOnInit(): void {
   this.buscar(null, 1);
  }

  buscar(event?: any, tipoCarga?: number) {
    if (tipoCarga === 2) {
      this.validarBuscar();
      if (!this.validarBuscar()) {
        this.messageService.add({ key: 'toast', severity: 'warn', summary: `Atención`, detail: 'Ingresar por lo menos un filtro de búsqueda' });
        return;
      }
    }

    let busquedaRequest: SedeBusquedaRequest = new SedeBusquedaRequest();
    busquedaRequest.institucionId = this.institucionId;
    busquedaRequest.nombre =this.nombre ? this.nombre.trim() : '';
    if (event) {
      if (event.rows !== undefined) this.cantidadPorPagina = event.rows;
      if (event.first !== undefined) this.first = event.first;
    }
    busquedaRequest.cantidadPorPagina = this.cantidadPorPagina;
    busquedaRequest.filaInicio = this.first
    this.subSink.add(this.listarSede(busquedaRequest))
  }

  validarBuscar(): boolean {
    if (this.nombre === undefined 
    ) {
      return false;
    }
    return true;
  }

  listarSede(request: SedeBusquedaRequest): SubscriptionLike {
    this.loading = true
    console.log(request)
    let subl: SubscriptionLike =
      this.sedeService.listPaginated(request)
        .subscribe({
          next: (res) => {
            console.log(res) 
            this.respuesta = res;
            this.loading = false

          },
          error: (error: any) => {
          },
        });
    return subl;
  }

  cargarSede(event): void { 
      this.buscar(event, 1) 
  }

  limpiar() {
    this.nombre = undefined;
    this.buscar(null, 1)
  }

  abrirModalRegistrarActualizar(sede: Sede,readOnly:boolean) {
    let data: any = {};
    data.sede = sede;
    data.readOnly = readOnly;
    data.institucionId = this.institucionId;

    let headerLabel = '';
    if(readOnly){
      headerLabel = 'Ver Registro'
    }else{
      console.log(sede)
      headerLabel= (!sede)?'Nuevo Registro':'Editar Registro'
    }
    this.dynamicDialogRegistrarActualizar = this.dialogService.open(SedeRegistrarActualizarComponent, {
      data: data,
      header: headerLabel,
      width: '850px',
      height: '700px',
      contentStyle: { "overflow": "auto" }, 
      closable: true,
      maximizable: false
    });

    this.dynamicDialogRegistrarActualizar.onClose.subscribe((value: any) => {
      if(value){ 
          this.messageService.add({ key: 'toast',severity: 'success', summary: 'Correcto', detail: `${value.mensaje}`,life:5000});
          this.buscar(); 
        }
      }
    );
  }

  
  evaluarRegistrarActualizar(sede:Sede,readOnly:boolean){
    console.log(sede);
    let data: Sede =sede;  
    if(data.sedeId==undefined){  
      this.abrirModalRegistrarActualizar(null,readOnly);
    }else{
      this.subSink.add(
        this.sedeService.findById(sede.sedeId)
        .subscribe({
          next: (res) => {
            console.log(res)
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

  sedeDelete:Sede;
  dialogDeleteVisible:boolean=false;

  closeModalDelete() {
    this.dialogDeleteVisible = false;
  }

  abrirConfirmacionEliminar(sede:Sede){
      this.sedeDelete = sede;
      this.dialogDeleteVisible = true;
      console.log("modal eliminar")

  }

  deleteById(){
    if(this.sedeDelete){
      this.sedeDelete.auditUsuarioModifica =   Utils.obtenerNombreUser()
      console.log(this.sedeDelete)
      this.subSink.add(
        this.sedeService.deleteById(this.sedeDelete)
        .subscribe({
          next: (res) => {
           //   this.messageService.add({ key: 'toast',severity: 'success', summary: 'Correcto', detail: `${res.mensaje}`,life:5000});
              this.buscar();
              this.dialogDeleteVisible = false;
          },
          error: (error: any) => {
          },
        })  
      )
    } 
  }
  onNameSearchChange() {
    this.nombre = this.validatorService.onInputChange(this.nombre);
  }
}
