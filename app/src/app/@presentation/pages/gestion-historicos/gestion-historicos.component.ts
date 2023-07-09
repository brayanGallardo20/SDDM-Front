import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Respuesta } from './../../../@data/model/respuesta';
import { Auditoria } from './../../../@data/model/auditoria';
import { Tabla } from './../../../@data/model/tabla';
import { MessageService } from 'primeng/api';
import { SubscriptionLike } from './../../../../../node_modules/subsink/dist/subsink.d';
import { TablaService } from './../../../@data/services/tabla.service';
import { AuditoriaService } from './../../../@data/services/auditoria.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { FunctionHelpers } from '../../shared/helper/function-helpers';
import { AuditoriaBusquedaRequest } from 'src/app/@data/model/request/auditoria-busqueda-request';
import { GhDetalleComponent } from './gh-detalle/gh-detalle.component';
import { ValidatorService } from '../../../@data/services/validator.service';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { Utils } from 'src/app/util/utils';

@Component({
  selector: 'app-gestion-historicos',
  templateUrl: './gestion-historicos.component.html',
  styleUrls: ['./gestion-historicos.component.scss']
})
export class GestionHistoricosComponent implements OnInit, OnDestroy {

  private readonly subSink = new SubSink();
  configuraciones: Configuracion;
  dynamicDialogRegistrarActualizar!: DynamicDialogRef;

  listadoTablas: Tabla[] = [];
  tablaSeleccionada!: Tabla;

  optionsPaginated: number[] = Utils.optionsPaginated;

  first: number = 0;
  last: number = 0;

  fechaInicio: Date;
  fechaFin: Date;

  respuesta: Respuesta<Auditoria[]> = new Respuesta();
  listadoAuditoria: Auditoria[] = [];
  auditoriaSeleccionado!: Auditoria;
  cantidadPorPagina: number;

  loading: boolean;

  listadoTipoAuditoria: any = Utils.listadoTipoAuditoria;

  tipoAuditoriaSeleccionado!: any;
  usuario: string;

  constructor(
    private readonly auditoriaService: AuditoriaService,
    private readonly tablaService: TablaService,
    private readonly messageService: MessageService,
    private readonly dialogService: DialogService,
    private validatorService: ValidatorService,
    private readonly configuracionService: ConfiguracionService
  ) {
    this.configuraciones = this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila
    this.buscar(null, 1);
  } 

  ngOnInit(): void {
    this.subSink.add(this.listarTablas()) 
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  listarTablas(): SubscriptionLike {
    let subl: SubscriptionLike =
      this.tablaService.listar()
        .subscribe({
          next: (res) => {
            this.listadoTablas = res.data;
          },
          error: (error: any) => {
          },
        });
    return subl;
  }

  buscar(event?: any, tipoCarga?: number) {
    if (tipoCarga === 2) {
      this.validarBuscar();
      if (!this.validarBuscar()) {
        this.messageService.add({ key: 'toast', severity: 'warn', summary: `Atención`, detail: 'Ingresar por lo menos un filtro de búsqueda' });
        return;
      }
    }

    let auditoriaRequest: AuditoriaBusquedaRequest = new AuditoriaBusquedaRequest();
    auditoriaRequest.tabla = (this.tablaSeleccionada) ? this.tablaSeleccionada.nombre : null;
    auditoriaRequest.auditFechaInicio = (this.fechaInicio != null && this.fechaInicio !== undefined) ? FunctionHelpers.formatDateToString(this.fechaInicio, 'dd/mm/yyyy') : null
    auditoriaRequest.auditFechaFin = (this.fechaFin != null && this.fechaFin !== undefined) ? FunctionHelpers.formatDateToString(this.fechaFin, 'dd/mm/yyyy') : null
    auditoriaRequest.usuario = this.usuario ? this.usuario.trim() : '';
    auditoriaRequest.auditTipo = (this.tipoAuditoriaSeleccionado) ? this.tipoAuditoriaSeleccionado.value : null;
    if (event) {
      if (event.rows !== undefined) this.cantidadPorPagina = event.rows;
      if (event.first !== undefined) this.first = event.first;
    }
    auditoriaRequest.cantidadPorPagina = this.cantidadPorPagina;
    auditoriaRequest.filaInicio = this.first
    this.subSink.add(this.listarAuditoria(auditoriaRequest))
  }

  validarBuscar(): boolean {
    if (this.tablaSeleccionada === undefined
      && this.tipoAuditoriaSeleccionado === undefined
      && this.fechaInicio === undefined
      && this.fechaFin === undefined
      && this.usuario === undefined
    ) {
      return false;
    }
    return true;
  }


  listarAuditoria(request: AuditoriaBusquedaRequest): SubscriptionLike {
    this.loading = true
    console.log(request)
    let subl: SubscriptionLike =
      this.auditoriaService.listBusqueda(request)
        .subscribe({
          next: (res) => {
            console.log(res)
            this.respuesta = res;
            this.respuesta.data = this.respuesta.data.map(element => {
              let valueFind = Utils.listadoTipoAuditoria.find(filter => filter.value === element.auditTipo);
              element.auditTipoDesc = (valueFind) ? valueFind.descripcion : ''
              return element;
            })
            this.loading = false
          },
          error: (error: any) => {
          },
        });
    return subl;
  }

  cargarAuditoria(event): void {
    console.log("Cargar auditoria")
      this.buscar(event, 1) 
  }

  mostrarDetalle(auditoria: Auditoria) {
    this.abrirDetalleAuditoria(auditoria)
  }

  abrirDetalleAuditoria(auditoria: Auditoria) {
    let data: any = {};
    data.auditoria = auditoria;
    this.dynamicDialogRegistrarActualizar = this.dialogService.open(GhDetalleComponent, {
      data: data,
      header: 'Detalle ',
      width: '800px',
      height: '700px',
      contentStyle: { "overflow": "auto" },
      baseZIndex: 10000,
      closable: true,
      maximizable: true
    });
  }

  limpiar() {
    this.tablaSeleccionada = undefined;
    this.tipoAuditoriaSeleccionado = undefined;
    this.fechaInicio = undefined;
    this.fechaFin = undefined;
    this.usuario = undefined;
    this.buscar(null, 1)
  }

  onUsuarioSearchChange() {
    this.usuario = this.validatorService.onInputChange(this.usuario);
  }
}
