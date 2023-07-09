import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription, SubscriptionLike } from 'rxjs';
import { Duty } from 'src/app/@data/model/duty';
import { DutyBusquedaRequest } from 'src/app/@data/model/request/duty-busqueda-request';
import { DutyService } from 'src/app/@data/services/duty.service';
import { ValidatorService } from 'src/app/@data/services/validator.service';
import { opciones, Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { Constants } from '../../shared/helper/constants';
 
@Component({
  selector: 'mant-duty',
  templateUrl: './duty.component.html',
  styleUrls: ['./duty.component.scss',
    '../shared-component-styles.scss']
})
export class DutyComponent implements OnInit {
  dutyDialog: boolean = false
  deleteDutyDialog: boolean = false;
  etapa: Duty;
  dutyList: Duty[] = [];
  dutyID: number;
  descripcion: string = '';
  operationType: string = '';
  dialogTitle: string;
  fecha: Date;
  rowsPerPageOptions = [5, 10, 20];
  disabled: boolean = false;
  cuantiaABuscar: string = '';
  etapaArbitral: number;
  cantidadPorPagina: number = Constants.cantidadPorPagina;
  private readonly subSink = new SubSink();
  totalRegistros: number;
  loading: boolean = true;
  @Input() institucionId: number ;
  dutySubscription!: Subscription;
  newDutySubscription!: Subscription;
  deleteDutySubscription!: Subscription;
  editDutySubscription!: Subscription;

  newDutyForm: FormGroup = this.fb.group({
    arancelId: [null],
    cuantia: ['', [Validators.required, Validators.maxLength(50)]],
    honorarioArbitro: ['', [Validators.required, Validators.maxLength(50)]],
    honorarioPagarParte: ['', [Validators.required, Validators.maxLength(50)]],
    fechaCreacion: ['']
  });

  newDuty!: Duty;

  constructor(
    private fb: FormBuilder,
    private dutyService: DutyService,
    private messageService: MessageService,
    private validatorService: ValidatorService
  ) { 
  }

  ngOnInit(): void {
    this.search();
  }

  get cuantia () {
    return this.newDutyForm.get('cuantia');
  }

  get honorarioArbitro () {
    return this.newDutyForm.get('honorarioArbitro');
  }

  get honorarioPagarParte () {
    return this.newDutyForm.get('honorarioPagarParte');
  }

  search(first?: number, tipoCarga?: number) {
    let requestBusqueda: DutyBusquedaRequest = new DutyBusquedaRequest();
    requestBusqueda.cuantia = this.cuantiaABuscar.trim();
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
        this.dutyService.listAll(requestBusqueda)
          .subscribe({
            next: (res) => {
              this.dutyList = res.data;
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
    if ( this.cuantiaABuscar !== '') {
      return true;
    }
    return false;
  }

  openDialog(dialogType: string, duty?: any) {
    switch (dialogType) {
      case 'new': {
        this.dialogTitle = 'Nuevo Registro';
        this.newDutyForm.reset();
        this.etapa = {};
        break;
      }
      case 'edit': {
        this.dialogTitle = 'Editar Registro';
        this.newDutyForm.setValue({
          arancelId:  duty.arancelId,
          cuantia: duty.cuantia,
          honorarioArbitro: duty.honorarioArbitro,
          honorarioPagarParte: duty.honorarioPagarParte,
          fechaCreacion: ''
        });
        break;
      }
      case 'view': {
        this.dialogTitle = 'Ver Registro';
        this.newDutyForm.setValue({
          arancelId:  duty.arancelId,
          cuantia: duty.cuantia,
          honorarioArbitro: duty.honorarioArbitro,
          honorarioPagarParte: duty.honorarioPagarParte,
          fechaCreacion: new Date(duty.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(",","")
        });
        break;
      }
    }
    this.operationType = dialogType;
    this.dutyDialog = true;
  }

  deleteEtapa(dutyId: number) {
    this.dutyID = dutyId;
    this.deleteDutyDialog = true;
  }

  hideDialog() {
    this.dutyDialog = false;
    this.newDutyForm.reset();
  }

  hidedeleteDutyDialog() {
    this.deleteDutyDialog = false;
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

    this.newDutySubscription = this.dutyService.insert({
      institucionId: this.institucionId,
      cuantia: this.newDutyForm.get('cuantia')?.value.trim(),
      honorarioArbitro: this.newDutyForm.get('honorarioArbitro')?.value.trim(),
      honorarioPagarParte: this.newDutyForm.get('honorarioPagarParte')?.value.trim(),
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    }).subscribe({
      next: (resp: Duty) => {
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
    this.dutyDialog = false;
    this.newDutyForm.reset();
  }

  deleteRecord() {
    this.deleteDutySubscription = this.dutyService.delete(this.dutyID).subscribe({
      next: (resp: Duty) => {
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
    this.deleteDutyDialog = false;
  }
 
  updateRecord() {
    this.newDuty = {
      arancelId: this.newDutyForm.get('arancelId')?.value,
      institucionId: this.institucionId,
      cuantia: this.newDutyForm.get('cuantia')?.value.trim(),
      honorarioArbitro: this.newDutyForm.get('honorarioArbitro')?.value.trim(),
      honorarioPagarParte: this.newDutyForm.get('honorarioPagarParte')?.value.trim(),
      auditUsuarioModifica: Utils.obtenerNombreUser()
    };

    this.editDutySubscription = this.dutyService.update(this.newDuty).subscribe({
      next: (resp: Duty) => {
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

    this.dutyDialog = false;
    this.newDutyForm.reset();
  }

  invalidField(field: string) {
    return this.newDutyForm.get(field)?.invalid && this.newDutyForm.get(field)?.touched;
  }

  invalidComboField(field: string) {
    return this.newDutyForm.get(field)?.invalid;
  }

  cleanFields() {
    this.cuantiaABuscar = '';
    this.search();
  }

  onNameSearchChange() {
    this.cuantiaABuscar = this.validatorService.onInputChange(this.cuantiaABuscar);
  }

  ngOnDestroy(): void {
    this.dutySubscription?.unsubscribe();
    this.newDutySubscription?.unsubscribe();
    this.deleteDutySubscription?.unsubscribe();
    this.editDutySubscription?.unsubscribe();
  }
}
