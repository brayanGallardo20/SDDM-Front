import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription, SubscriptionLike } from 'rxjs';
import { SpecializationBusquedaRequest } from 'src/app/@data/model/request/specialization-busqueda-request';
import { opciones, Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { SpecialtyModel } from '../../../@data/model/specialty.model';
import { Constants } from '../../shared/helper/constants';
import { ValidatorService } from '../../../@data/services/validator.service';
import { SpecialtyService } from 'src/app/@data/services/specialty.service';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';
 
@Component({
  selector: 'app-master-specialty',
  templateUrl: './master-specialty.component.html',
  styleUrls: ['./master-specialty.component.scss']
})   
export class MasterSpecialtyComponent implements OnInit, OnDestroy {
  configuraciones:Configuracion;
  specialtyDialog: boolean = false
  deleteSpecialtyDialog: boolean = false;
  specialty: SpecialtyModel;
  specialtys: SpecialtyModel[] = [];
  especialidadId: number;
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

  specialtySubscription!: Subscription;
  newSpecialtySubscription!: Subscription;
  deleteSpecialtySubscription!: Subscription;
  editSpecialtySubscription!: Subscription;

  newSpecialtyForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    especialidadId: [''],
    fechaCreacion: ['']
  });

  newSpecialization!: SpecialtyModel;

  constructor(
    private fb: FormBuilder,
    private specialtyservice: SpecialtyService,
    private messageService: MessageService,
    private configuracionService:ConfiguracionService
  ) { 

    this.configuraciones =  this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila

  }

  ngOnInit(): void {
    this.search();
  }

  get nombre () {
    return this.newSpecialtyForm.get('nombre');
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
        this.specialtyservice.listAll(requestBusqueda)
          .subscribe({
            next: (res) => {
              this.specialtys = res.data;
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

  openDialog(dialogType: string, specialty?: any) {
    switch (dialogType) {
      case 'new': {
        this.dialogTitle = 'Nuevo Registro';
        this.newSpecialtyForm.reset();
        this.specialty = {};
        break;
      }
      case 'edit': {
        this.dialogTitle = 'Editar Registro';
        this.newSpecialtyForm.setValue({
          nombre: specialty.nombre,
          especialidadId:  specialty.especialidadId,
          fechaCreacion: ''
        });
        break;
      }
      case 'view': {
        this.dialogTitle = 'Ver Registro';
        this.newSpecialtyForm.setValue({
          nombre: specialty.nombre,
          especialidadId:  specialty.especialidadId,
          fechaCreacion: new Date(specialty.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(",","")
        });
        break;
      }
    }
    this.operationType = dialogType;
    this.specialtyDialog = true;
  }

  deleteSpecialty(especializacion: any) {
    this.especialidadId = especializacion.especialidadId;
    this.deleteSpecialtyDialog = true;
  }

  hideDialog() {
    this.specialtyDialog = false;
    this.newSpecialtyForm.reset();
  }

  hideDeleteSpecialtyDialog() {
    this.deleteSpecialtyDialog = false;
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
      nombre: this.newSpecialtyForm.get('nombre')?.value.trim(),
      especialidadId: this.newSpecialtyForm.get('especialidadId')?.value,
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    };

    this.newSpecialtySubscription = this.specialtyservice.save({
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
    this.specialtyDialog = false;
    this.newSpecialtyForm.reset();
  }

  deleteRecord() {
    this.deleteSpecialtySubscription = this.specialtyservice.delete(this.especialidadId).subscribe({
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
    this.deleteSpecialtyDialog = false;
  }
 
  updateRecord() {
    this.newSpecialization = {
      nombre: this.newSpecialtyForm.get('nombre')?.value.trim(),
      especialidadId: this.newSpecialtyForm.get('especialidadId')?.value,
      auditUsuarioModifica: Utils.obtenerNombreUser()
    };

    this.editSpecialtySubscription = this.specialtyservice.update(this.newSpecialization).subscribe({
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

    this.specialtyDialog = false;
    this.newSpecialtyForm.reset();
  }

  invalidField(field: string) {
    return this.newSpecialtyForm.get(field)?.invalid && this.newSpecialtyForm.get(field)?.touched;
  }

  invalidComboField(field: string) {
    return this.newSpecialtyForm.get(field)?.invalid;
  }

  cleanFields() {
    this.nombreABuscar = '';
    this.search();
  }

 
  ngOnDestroy(): void {
    this.specialtySubscription?.unsubscribe();
    this.newSpecialtySubscription?.unsubscribe();
    this.deleteSpecialtySubscription?.unsubscribe();
    this.editSpecialtySubscription?.unsubscribe();
  }
}
