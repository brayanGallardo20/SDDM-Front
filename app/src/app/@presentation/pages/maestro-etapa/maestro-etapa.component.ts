import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription, SubscriptionLike, finalize } from 'rxjs';
import { EtapaArbitralBusquedaRequest } from 'src/app/@data/model/request/etapa-arbitral-busqueda-request';
import { SubArbitraje } from 'src/app/@data/model/sub-etapa.model';
import { EtapaService } from 'src/app/@data/services/etapa-service';
import { opciones, Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { EtapaArbitralModel } from '../../../@data/model/etapa.model';
import { SubArbitrajeResponse } from '../../../@data/model/sub-etapa-response.model';
import { ValidatorService } from '../../../@data/services/validator.service';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';

@Component({
  selector: 'app-maestro-etapa',
  templateUrl: './maestro-etapa.component.html',
  styleUrls: ['./maestro-etapa.component.scss']
})
export class MaestroEtapaComponent implements OnInit, OnDestroy {

  configuraciones: Configuracion;
  etapadDialog: boolean = false
  deleteEtapaDialog: boolean = false;
  etapa: EtapaArbitralModel;
  etapas: EtapaArbitralModel[] = [];
  etapaID: number;
  descripcion: string = '';
  operationType: string = '';
  dialogTitle: string;
  fecha: Date;
  disabled: boolean = false;
  nombreABuscar: string = '';
  etapaArbitral: number;
  cantidadPorPagina: number;
  private readonly subSink = new SubSink();
  totalRegistros: number=10;
  loading: boolean = true;

  optionsPaginated: number[] = Utils.optionsPaginated;

  subEtapaSubscription!: Subscription;
  newSubEtapaSubscription!: Subscription;
  deleteEtapaSubscription!: Subscription;
  editSubEtapaSubscription!: Subscription;

  newEtapaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    orden: ['', [Validators.required]],
    idEtapaArbitral: [''],
    fechaCreacion: ['']
  });

  newSubEtapa!: SubArbitraje;

  constructor(
    private fb: FormBuilder,
    private etapaService: EtapaService,
    private messageService: MessageService,
    private validatorService: ValidatorService,
    private configuracionService: ConfiguracionService
  ) {
    this.configuraciones = this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila
    this.validateSpacesWhiteAndUpper('nombre');
  }
  ngOnInit(): void {
    this.newEtapaForm.get('nombre')?.valueChanges.subscribe(value => {
      if (value && this.operationType === 'new') {
        this.newEtapaForm.get('nombre')?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
    this.newEtapaForm.get('orden')?.valueChanges.subscribe(value => {
      if (value && this.operationType === 'new') {
        this.newEtapaForm.get('orden')?.setValue(value, { emitEvent: false });
      }
    });
    this.search();
  }

  get nombre() {
    return this.newEtapaForm.get('nombre');
  }

  get orden() {
    return this.newEtapaForm.get('orden');
  }
  search(first?: number, tipoCarga?: number) {
    let requestBusqueda: EtapaArbitralBusquedaRequest = new EtapaArbitralBusquedaRequest();
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

  validateSpacesWhiteAndUpper(control:string){
    this.newEtapaForm.get(control).valueChanges.subscribe((value) => {
      if (value != null) {
          if(value.trim()===''){
            this.newEtapaForm.patchValue( {[control]:null} )
          }else{
            this.newEtapaForm.get(control)?.patchValue(value.toUpperCase(), { emitEvent: false });
          }
      }
    });
  }

  getAllRecords(requestBusqueda): SubscriptionLike {
    this.loading = true
    let subl: SubscriptionLike =
      this.etapaService.
   
      listAll(requestBusqueda) 
        .subscribe({
          next: (res) => {
            console.log(res)
            this.etapas = res.data;
        /*     setTimeout(() => {
              this.totalRegistros = res.totalRegistros;
            }, 1000); */
     
            this.loading = false;
          },
          error: (error: any) => {
          },
        });
    return subl;
  }

/*   asignarTotalRecords(totalRegistros:number){
    this.totalRegistros = totalRegistros;
  } */

  validateSearch(): boolean {
    if (this.nombreABuscar !== '') {
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
          orden: etapa.orden,
          idEtapaArbitral: etapa.etapaArbitralId,
          fechaCreacion: ''
        });
        break;
      }
      case 'view': {
        this.dialogTitle = 'Ver Registro';
        this.newEtapaForm.setValue({
          nombre: etapa.nombre,
          orden: etapa.orden,
          idEtapaArbitral: etapa.etapaArbitralId,
          fechaCreacion: new Date(etapa.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(",", "")
        });
        break;
      }
    }
    this.operationType = dialogType;
    this.etapadDialog = true;
  }

  deleteEtapa(subEtapaId: number) {
    this.etapaID = subEtapaId;
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

    if (this.operationType === 'new') {
      this.saveNewRecord();
    }

    if (this.operationType === 'edit') {
      this.updateRecord();
    }
  }

  saveNewRecord() {
    this.newSubEtapa = {
      nombre: this.newEtapaForm.get('nombre')?.value.trim(),
      etapaArbitralId: this.newEtapaForm.get('idEtapaArbitral')?.value,
      orden: this.newEtapaForm.get('orden')?.value,
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    }; 
    this.newSubEtapaSubscription = this.etapaService.save(
           {
      nombre: this.newSubEtapa.nombre,
      orden: this.newSubEtapa.orden,
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    }).subscribe({
      next: (resp: SubArbitrajeResponse) => {
        this.messageService.add({ key: 'toast', severity: 'success', summary: 'Éxito', detail: 'Se guardó el registro satisfactoriamente', life: 3000 });
        this.search();
      },
      error: (err: any) => {
      }
    }); 
    this.etapadDialog = false;
    this.newEtapaForm.reset();
  }

  deleteRecord() {
    this.deleteEtapaSubscription = this.etapaService.delete(this.etapaID).subscribe({
      next: (resp: SubArbitrajeResponse) => {
        this.cleanFields();
        this.search();
      },
      error: (err) => { 
      }
    });
    this.deleteEtapaDialog = false;
  }

  updateRecord() {
    this.newSubEtapa = {
      nombre: this.newEtapaForm.get('nombre')?.value.trim(),
      etapaArbitralId: this.newEtapaForm.get('idEtapaArbitral')?.value,
      auditUsuarioModifica: Utils.obtenerNombreUser(),
      orden: this.newEtapaForm.get('orden')?.value
    };

    this.editSubEtapaSubscription = this.etapaService.update(this.newSubEtapa).subscribe({
      next: (resp: SubArbitrajeResponse) => {
        this.messageService.add({ key: 'toast', severity: 'success', summary: 'Éxito', detail: 'Se actualizó el registro satisfactoriamente', life: 3000 });
        this.search();
      },
      error: (err: any) => {
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
