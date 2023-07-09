import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription, SubscriptionLike } from 'rxjs';
import { SpecializationBusquedaRequest } from 'src/app/@data/model/request/specialization-busqueda-request';
import { SpecializationService } from 'src/app/@data/services/specialization-service';
import { opciones, Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { SpecializationModel } from '../../../@data/model/specialization.model';
import { Constants } from '../../shared/helper/constants';
import { ValidatorService } from '../../../@data/services/validator.service';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';

@Component({
  selector: 'app-master-specialization',
  templateUrl: './master-specialization.component.html',
  styleUrls: ['./master-specialization.component.scss']
})  
export class MasterSpecializationComponent implements OnInit, OnDestroy {

  configuraciones:Configuracion;
  specializationDialog: boolean = false
  deleteSpecializationDialog: boolean = false;
  specialization: SpecializationModel;
  specializations: SpecializationModel[] = [];
  especializacionId: number;
  descripcion: string = '';
  operationType: string = '';
  dialogTitle: string;
  fecha: Date;
  rowsPerPageOptions = [5, 10, 20];
  disabled: boolean = false;
  nombreABuscar: string = '';
  cantidadPorPagina: number = Constants.cantidadPorPagina;
  private readonly subSink = new SubSink();
  totalRegistros: number;
  loading: boolean = true;
  optionsPaginated:number[] =Utils.optionsPaginated;

  specializationSubscription!: Subscription;
  newSpecializationSubscription!: Subscription;
  deleteSpecializationSubscription!: Subscription;
  editspecializationSubscription!: Subscription;

  newSpecializationForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    especializacionId: [''],
    fechaCreacion: ['']
  });

  newSpecialization!: SpecializationModel;

  constructor(
    private fb: FormBuilder,
    private specializationService: SpecializationService,
    private messageService: MessageService,
    private validatorService: ValidatorService,
    private configuracionService:ConfiguracionService
  ) {
    this.configuraciones =  this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila
   }

  ngOnInit(): void {
    this.newSpecializationForm.get('nombre')?.valueChanges.subscribe(value => {
      if(value && this.operationType === 'new') {
        this.newSpecializationForm.get('nombre')?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
    this.search();
  }

  get nombre () {
    return this.newSpecializationForm.get('nombre');
  }

  search(first?: number, tipoCarga?: number) {
    let requestBusqueda: SpecializationBusquedaRequest = new SpecializationBusquedaRequest();
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
        this.specializationService.listAll(requestBusqueda)
          .subscribe({
            next: (res) => {
              this.specializations = res.data;
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

  openDialog(dialogType: string, specialization?: any) {
    switch (dialogType) {
      case 'new': {
        this.dialogTitle = 'Nuevo Registro';
        this.newSpecializationForm.reset();
        this.specialization = {};
        break;
      }
      case 'edit': {
        this.dialogTitle = 'Editar Registro';
        this.newSpecializationForm.setValue({
          nombre: specialization.nombre,
          especializacionId:  specialization.especializacionId,
          fechaCreacion: ''
        });
        break;
      }
      case 'view': {
        this.dialogTitle = 'Ver Registro';
        this.newSpecializationForm.setValue({
          nombre: specialization.nombre,
          especializacionId:  specialization.especializacionId,
          fechaCreacion: new Date(specialization.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(",","")
        });
        break;
      }
    }
    this.operationType = dialogType;
    this.specializationDialog = true;
  }

  deleteSpecialization(especializacion: any) {
    this.especializacionId = especializacion.especializacionId;
    this.deleteSpecializationDialog = true;
  }

  hideDialog() {
    this.specializationDialog = false;
    this.newSpecializationForm.reset();
  }

  hidedeleteSpecializationDialog() {
    this.deleteSpecializationDialog = false;
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
    this.newSpecialization = {
      nombre: this.newSpecializationForm.get('nombre')?.value.trim(),
      especializacionId: this.newSpecializationForm.get('especializacionId')?.value,
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    };

    this.newSpecializationSubscription = this.specializationService.save({
      nombre: this.newSpecialization.nombre,
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
    this.specializationDialog = false;
    this.newSpecializationForm.reset();
  }

  deleteRecord() {
    this.deleteSpecializationSubscription = this.specializationService.delete(this.especializacionId).subscribe({
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
    this.deleteSpecializationDialog = false;
  }
  
  updateRecord() {
    this.newSpecialization = {
      nombre: this.newSpecializationForm.get('nombre')?.value.trim(),
      especializacionId: this.newSpecializationForm.get('especializacionId')?.value,
      auditUsuarioModifica: Utils.obtenerNombreUser()
    };

    this.editspecializationSubscription = this.specializationService.update(this.newSpecialization).subscribe({
      next: (resp: any) => {
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

    this.specializationDialog = false;
    this.newSpecializationForm.reset();
  }

  invalidField(field: string) {
    return this.newSpecializationForm.get(field)?.invalid && this.newSpecializationForm.get(field)?.touched;
  }

  invalidComboField(field: string) {
    return this.newSpecializationForm.get(field)?.invalid;
  }

  cleanFields() {
    this.nombreABuscar = '';
    this.search();
  }

  onNameSearchChange() {
    this.nombreABuscar = this.validatorService.onInputChange(this.nombreABuscar);
  }

  ngOnDestroy(): void {
    this.specializationSubscription?.unsubscribe();
    this.newSpecializationSubscription?.unsubscribe();
    this.deleteSpecializationSubscription?.unsubscribe();
    this.editspecializationSubscription?.unsubscribe();
  }
}
