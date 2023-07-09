import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription, SubscriptionLike } from 'rxjs';
import { ArbitrationMatterBusquedaRequest } from 'src/app/@data/model/request/arbitrationMatter-busqueda-request';
import { ArbitrationMatterService } from 'src/app/@data/services/arbitration-matter-service';
import { opciones, Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { ArbitrationMatterModel } from '../../../@data/model/arbitrationMatter.model';
import { SubArbitrajeResponse } from '../../../@data/model/sub-etapa-response.model';
import { Constants } from '../../shared/helper/constants';
import { ValidatorService } from '../../../@data/services/validator.service';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service'

@Component({
  selector: 'app-master-arbitrationMatter',
  templateUrl: './master-arbitrationMatter.component.html',
  styleUrls: ['./master-arbitrationMatter.component.scss']
})  
export class ArbitrationMatterComponent implements OnInit, OnDestroy {
  etapadDialog: boolean = false
  deleteEtapaDialog: boolean = false;
  etapa: ArbitrationMatterModel;
  etapas: ArbitrationMatterModel[] = [];
  materiaArbitralId: number;
  descripcion: string = '';
  operationType: string = '';
  dialogTitle: string;
  fecha: Date;
  rowsPerPageOptions = [5, 10, 20];
  disabled: boolean = false;
  nombreABuscar: string = '';
  etapaArbitral: number;
  cantidadPorPagina: number;
  private readonly subSink = new SubSink();
  totalRegistros: number;
  loading: boolean = true;
  configuraciones: Configuracion;
  optionsPaginated: number[] = Utils.optionsPaginated;
  first: number = 0;
  last: number = 0;

  subEtapaSubscription!: Subscription;
  newSubEtapaSubscription!: Subscription;
  deleteEtapaSubscription!: Subscription;
  editSubEtapaSubscription!: Subscription;

  newEtapaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    materiaArbitralId: [''],
    fechaCreacion: ['']
  });

  newSubEtapa!: ArbitrationMatterModel;

  constructor(
    private fb: FormBuilder,
    private arbitralMatterService: ArbitrationMatterService,
    private messageService: MessageService,
    private configuracionService:ConfiguracionService,
    private validatorService: ValidatorService
  ) {
    this.configuraciones = this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila
   }

  ngOnInit(): void {
    this.newEtapaForm.get('nombre')?.valueChanges.subscribe(value => {
      if(value && this.operationType === 'new') {
        this.newEtapaForm.get('nombre')?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
    this.search();
  }

  get nombre () {
    return this.newEtapaForm.get('nombre');
  }

  search(first?: number, tipoCarga?: number) {
    let requestBusqueda: ArbitrationMatterBusquedaRequest = new ArbitrationMatterBusquedaRequest();
    requestBusqueda.nombre = this.nombreABuscar.trim();
    requestBusqueda.cantidadPorPagina = this.cantidadPorPagina;
    if (tipoCarga === 2) {
      if (!this.validateSearch()) {
        this.messageService.add({ key: 'toast', severity: 'warn', summary: `Atención`, detail: 'Ingresar por lo menos un filtro de búsqueda' });
        return;
      }
    }

    if (first) requestBusqueda.filaInicio = first
    this.subSink.add(this.getAllRecords(requestBusqueda))
  }
 
  getAllRecords(requestBusqueda) : SubscriptionLike {
      this.loading = true
      let subl: SubscriptionLike =
        this.arbitralMatterService.listAll(requestBusqueda)
          .subscribe({
            next: (res) => {
              this.etapas = res.data;
              this.totalRegistros = res.totalRegistros;
              this.loading = false;
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

  validateSearch(): boolean {
    if ( this.nombreABuscar !== '') {
      return true;
    }
    return false;
  }

  openDialog(dialogType: string, etapa?: any) {
    switch (dialogType) {
      case 'new': {
        this.dialogTitle = 'Nuevo Registro';
        this.newEtapaForm.reset();
        this.etapa = {};
        break;
      }
      case 'edit': {
        this.dialogTitle = 'Editar Registro';
        this.newEtapaForm.setValue({
          nombre: etapa.nombre,
          materiaArbitralId:  etapa.materiaArbitralId,
          fechaCreacion: ''
        });
        break;
      }
      case 'view': {
        this.dialogTitle = 'Ver Registro';
        this.newEtapaForm.setValue({
          nombre: etapa.nombre,
          materiaArbitralId:  etapa.materiaArbitralId,
          fechaCreacion: new Date(etapa.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(",","")
        });
        break;
      }
    }
    this.operationType = dialogType;
    this.etapadDialog = true;
  }

  deleteEtapa(materiaArbitral: any) {
    this.materiaArbitralId = materiaArbitral.materiaArbitralId;
    this.deleteEtapaDialog = true;
  }

  hideDialog() {
    this.etapadDialog = false;
    this.newEtapaForm.reset();
  }

  hidedeleteEtapaDialog() {
    this.deleteEtapaDialog = false;
  }

  save() {

    if(this.operationType === 'new') {
       this.saveNewRecord();
    }

    if(this.operationType === 'edit') {
      this.updateRecord();
   }

  }

  saveNewRecord() {
    this.newSubEtapa = {
      nombre: this.newEtapaForm.get('nombre')?.value.trim(),
      materiaArbitralId: this.newEtapaForm.get('materiaArbitralId')?.value,
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    };

    this.newSubEtapaSubscription = this.arbitralMatterService.save({
      nombre: this.newSubEtapa.nombre,
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    }).subscribe({
      next: (resp: any) => {
        this.messageService.add({ key: 'toast', severity: 'success', summary: 'Exito', detail: 'Se guardó el registro satisfactoriamente', life: 3000 });
        this.search();
      },
      error: (err: any) => {
        if (err.status === 0) {
          this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Se perdió conexión con el servidor` });
        } else {
          if (err.status === 400) {
            this.messageService.add({ key: 'warn', severity: 'warn', summary: `${err.error.mensaje}`, detail: err.error.detalles });
          } else if (err.status === 500) {
            this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${err.statusText}` });
          }
        }
      }
    });
    this.etapadDialog = false;
    this.newEtapaForm.reset();
  }

  deleteRecord() {
    this.deleteEtapaSubscription = this.arbitralMatterService.delete(this.materiaArbitralId).subscribe({
      next: (resp: any) => {
        this.cleanFields();
        this.search();
      },
      error: (err) => {
        if (err.status === 0) {
          this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Se perdió conexión con el servidor` });
        } else {
          if (err.status === 400) {
            this.messageService.add({ key: 'warn', severity: 'warn', summary: `${err.error.mensaje}`, detail: err.error.detalles });
          } else if (err.status === 500) {
            this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${err.statusText}` });
          }
        }
      }
    });
    this.deleteEtapaDialog = false;
  }
 
  updateRecord() {
    this.newSubEtapa = {
      nombre: this.newEtapaForm.get('nombre')?.value.trim(),
      materiaArbitralId: this.newEtapaForm.get('materiaArbitralId')?.value,
      auditUsuarioModifica: Utils.obtenerNombreUser()
    };

    this.editSubEtapaSubscription = this.arbitralMatterService.update(this.newSubEtapa).subscribe({
      next: (resp: SubArbitrajeResponse) => {
        this.messageService.add({ key: 'toast', severity: 'success', summary: 'Éxito', detail: 'Se actualizó el registro satisfactoriamente', life: 3000 });
        this.search();
      },
      error: (err: any) => {
        if (err.status === 0) {
          this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Se perdió conexión con el servidor` });
        } else {
          if (err.status === 400) {
            this.messageService.add({ key: 'warn', severity: 'warn', summary: `${err.error.mensaje}`, detail: err.error.detalles });
          } else if (err.status === 500) {
            this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${err.statusText}` });
          }
        }
      }
    });

    this.etapadDialog = false;
    this.newEtapaForm.reset();
  }

  invalidField(field: string) {
    return this.newEtapaForm.get(field)?.invalid && this.newEtapaForm.get(field)?.touched;
  }

  invalidComboField(field: string) {
    return this.newEtapaForm.get(field)?.invalid;
  }

  cleanFields() {
    this.nombreABuscar = '';
    this.search();
  }

  onNameSearchChange() {
    this.nombreABuscar = this.validatorService.onInputChange(this.nombreABuscar);
  }

  ngOnDestroy(): void {
    this.subEtapaSubscription?.unsubscribe();
    this.newSubEtapaSubscription?.unsubscribe();
    this.deleteEtapaSubscription?.unsubscribe();
    this.editSubEtapaSubscription?.unsubscribe();
  }
}
