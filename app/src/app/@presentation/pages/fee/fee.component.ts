import { Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import { Historical } from 'src/app/@data/model/historical';
import { MessageService } from 'primeng/api';
import { opciones, Utils } from 'src/app/util/utils';
import { Fee } from 'src/app/@data/model/fee';
import { FeeService } from 'src/app/@data/services/fee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/@data/services/validator.service';
import { Subscription, SubscriptionLike } from 'rxjs';
import { Constants } from '../../shared/helper/constants';
import { SubSink } from 'subsink';
import { FeeBusquedaRequest } from 'src/app/@data/model/request/fee-busqueda-request';

@Component({
  selector: 'mant-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss',
    '../shared-component-styles.scss']
})
export class FeeComponent implements OnInit {
 
  feeDialog: boolean = false
  deletefeeDialog: boolean = false;
  etapa: Fee;
  feeList: Fee[] = [];
  feeID: number;
  descripcion: string = '';
  operationType: string = '';
  dialogTitle: string;
  fecha: Date;
  rowsPerPageOptions = [5, 10, 20];
  disabled: boolean = false;
  servicioABuscar: string = '';
  etapaArbitral: number;
  cantidadPorPagina: number = Constants.cantidadPorPagina;
  private readonly subSink = new SubSink();
  totalRegistros: number;
  loading: boolean = true;
  @Input() institucionId: number;
  dutySubscription!: Subscription;
  newDutySubscription!: Subscription;
  deleteDutySubscription!: Subscription;
  editDutySubscription!: Subscription;

  newFeeForm: FormGroup = this.fb.group({
    tarifaId: [null],
    servicio: ['', [Validators.required, Validators.maxLength(50)]],
    requisito: ['', [Validators.required, Validators.maxLength(50)]],
    derechoPagoUit: ['', [Validators.required, Validators.maxLength(50)]],
    plazoAtencion: ['', [Validators.required, Validators.maxLength(50)]],
    fechaCreacion: ['']
  });

  newDuty!: Fee;

  constructor(
    private fb: FormBuilder,
    private feeService: FeeService,
    private messageService: MessageService,
    private validatorService: ValidatorService
  ) { 
  }

  ngOnInit(): void {
    this.search();
  }

  get servicio () {
    return this.newFeeForm.get('servicio');
  }

  get requisito () {
    return this.newFeeForm.get('requisito');
  }

  get derechoPagoUit () {
    return this.newFeeForm.get('derechoPagoUit');
  }

  get plazoAtencion () {
    return this.newFeeForm.get('plazoAtencion');
  }

  search(first?: number, tipoCarga?: number) {
    let requestBusqueda: FeeBusquedaRequest = new FeeBusquedaRequest();
    requestBusqueda.servicio = this.servicioABuscar.trim();
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
        this.feeService.listAll(requestBusqueda)
          .subscribe({
            next: (res) => {
              this.feeList = res.data;
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
    if ( this.servicioABuscar !== '') {
      return true;
    }
    return false;
  }

  openDialog(dialogType: string, fee?: any) {
    switch (dialogType) {
      case 'new': {
        this.dialogTitle = 'Nuevo Registro';
        this.newFeeForm.reset();
        this.etapa = {};
        break;
      }
      case 'edit': {
        this.dialogTitle = 'Editar Registro';
        this.newFeeForm.setValue({
          tarifaId:  fee.tarifaId, 
          servicio: fee.servicio,
          requisito: fee.requisito,
          derechoPagoUit: fee.derechoPagoUit,
          plazoAtencion: fee.plazoAtencion,
          fechaCreacion: ''
        });
        break;
      }
      case 'view': {
        this.dialogTitle = 'Ver Registro';
        this.newFeeForm.setValue({
          tarifaId:  fee.tarifaId, 
          servicio: fee.servicio,
          requisito: fee.requisito,
          derechoPagoUit: fee.derechoPagoUit,
          plazoAtencion: fee.plazoAtencion,
          fechaCreacion: new Date(fee.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(",","")
        });
        break;
      }
    }
    this.operationType = dialogType;
    this.feeDialog = true;
  }

  deleteEtapa(feeID: number) {
    this.feeID = feeID;
    this.deletefeeDialog = true;
  }

  hideDialog() {
    this.feeDialog = false;
    this.newFeeForm.reset();
  }

  hidedeletefeeDialog() {
    this.deletefeeDialog = false;
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

    this.newDutySubscription = this.feeService.insert({
      institucionId: this.institucionId,
      servicio: this.newFeeForm.get('servicio')?.value.trim(),
      requisito: this.newFeeForm.get('requisito')?.value.trim(),
      derechoPagoUit: this.newFeeForm.get('derechoPagoUit')?.value.trim(),
      plazoAtencion: this.newFeeForm.get('plazoAtencion')?.value.trim(),
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    }).subscribe({
      next: (resp: Fee) => {
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
    this.feeDialog = false;
    this.newFeeForm.reset();
  }

  deleteRecord() {
    this.deleteDutySubscription = this.feeService.delete(this.feeID).subscribe({
      next: (resp: Fee) => {
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
    this.deletefeeDialog = false;
  }
 
  updateRecord() {
    this.newDuty = {
      tarifaId: this.newFeeForm.get('tarifaId')?.value,
      institucionId: this.institucionId,
      servicio: this.newFeeForm.get('servicio')?.value.trim(),
      requisito: this.newFeeForm.get('requisito')?.value.trim(),
      derechoPagoUit: this.newFeeForm.get('derechoPagoUit')?.value.trim(),
      plazoAtencion: this.newFeeForm.get('plazoAtencion')?.value.trim(),
      auditUsuarioModifica: Utils.obtenerNombreUser()
    };

    this.editDutySubscription = this.feeService.update(this.newDuty).subscribe({
      next: (resp: Fee) => {
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

    this.feeDialog = false;
    this.newFeeForm.reset();
  }

  invalidField(field: string) {
    return this.newFeeForm.get(field)?.invalid && this.newFeeForm.get(field)?.touched;
  }

  invalidComboField(field: string) {
    return this.newFeeForm.get(field)?.invalid;
  }

  cleanFields() {
    this.servicioABuscar = '';
    this.search();
  }

  onNameSearchChange() {
    this.servicioABuscar = this.validatorService.onInputChange(this.servicioABuscar);
  }

  ngOnDestroy(): void {
    this.dutySubscription?.unsubscribe();
    this.newDutySubscription?.unsubscribe();
    this.deleteDutySubscription?.unsubscribe();
    this.editDutySubscription?.unsubscribe();
  }
}
