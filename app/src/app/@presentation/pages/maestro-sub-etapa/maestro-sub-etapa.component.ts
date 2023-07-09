import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription, SubscriptionLike } from 'rxjs';
import { SubEtapaArbitralBusquedaRequest } from 'src/app/@data/model/request/sub-etapa-arbitral-busqueda-request';
import { SubArbitraje } from 'src/app/@data/model/sub-etapa.model';
import { SubEtapaService } from 'src/app/@data/services/sub-etapa.service';
import { opciones, Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { EtapaArbitralModel } from '../../../@data/model/etapa.model';
import { SubArbitrajeResponse } from '../../../@data/model/sub-etapa-response.model';
import { ValidatorService } from '../../../@data/services/validator.service';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';
import { Configuracion } from 'src/app/@data/model/configuracion';

@Component({
  selector: 'app-maestro-sub-etapa',
  templateUrl: './maestro-sub-etapa.component.html',
  styleUrls: ['./maestro-sub-etapa.component.scss']
})
export class MaestroSubEtapaComponent implements OnInit, OnDestroy {
  configuraciones:Configuracion;
  subEtapadDialog: boolean = false
  deleteSubEtapaDialog: boolean = false;
  subEtapa: SubArbitraje;
  subEtapas: SubArbitraje[] = [];
  subEtapaID: number;
  descripcion: string = '';
  operationType: string = '';
  dialogTitle: string;
  fecha: Date;
  optionsPaginated:number[] =Utils.optionsPaginated;
  disabled: boolean = false;
  nombreABuscar: string = '';
  etapaABuscar: string = '';
  etapasArbitrales: EtapaArbitralModel[];
  etapaArbitral: number;
  cantidadPorPagina: number;
  private readonly subSink = new SubSink();
  loading:boolean = true;

  subEtapaSubscription!: Subscription;
  newSubEtapaSubscription!: Subscription;
  deleteSubEtapaSubscription!: Subscription;
  editSubEtapaSubscription!: Subscription;
  etapaSubscription!: Subscription;

  newSubEtapaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    etapaArbitral: ['', [Validators.required]],
    orden: ['', [Validators.required]],
    fechaCreacion: ['']
  });
 
  newSubEtapa!: SubArbitraje;

  constructor(
    private fb: FormBuilder,
    private subEtapaService: SubEtapaService,
    private messageService: MessageService,
    private validatorService: ValidatorService, 
    private readonly configuracionService:ConfiguracionService 
  ) {
    this.configuraciones =  this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila
    this.validateSpacesWhiteAndUpper('nombre');
    this.getEtapaList();
  }

  ngOnInit(): void {
    this.newSubEtapaForm.get('nombre')?.valueChanges.subscribe(value => {
      if(value && this.operationType === 'new') {
        this.newSubEtapaForm.get('nombre')?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
    this.search();
  }

  get nombre () {
    return this.newSubEtapaForm.get('nombre');
  }


  get etapa () {
    return this.newSubEtapaForm.get('etapaArbitral');
  }

  get orden () {
    return this.newSubEtapaForm.get('orden');
  }

  limpiarInput() {
    this.newSubEtapaForm.setValue({
      nombre: null,
      etapaArbitral: null,
      orden: null,
      fechaCreacion: ''
    });
    this.etapaArbitral = null;
  }

  getEtapaList() {
    this.etapaSubscription = this.subEtapaService.listEtapas().subscribe({
      next: (res) => {
        this.etapasArbitrales = res.data;
      },
      error: (err) => {
      }
    });
    this.loading = false;
  }

  search(first?: number, tipoCarga?: number) {
    let requestBusqueda: SubEtapaArbitralBusquedaRequest = new SubEtapaArbitralBusquedaRequest();
    requestBusqueda.nombre = this.nombreABuscar.trim();
    requestBusqueda.nombreEtapaArbitral = this.etapaABuscar.trim();
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
    this.newSubEtapaForm.get(control).valueChanges.subscribe((value) => {
      if (value != null) {
          if(value.trim()===''){
            this.newSubEtapaForm.patchValue( {[control]:null} )
          }else{
            this.newSubEtapaForm.get(control)?.patchValue(value.toUpperCase(), { emitEvent: false });
          }
      }
    });
  }
 
  getAllRecords(requestBusqueda) : SubscriptionLike {
      this.loading = true
      let subl: SubscriptionLike =
        this.subEtapaService.listAll(requestBusqueda)
          .subscribe({
            next: (res) => {
              this.subEtapas = res.data;
            },
            error: (error: any) => {
            },
          });
      this.loading = false;
      return subl;
    }

  validateSearch(): boolean {
    if ( this.nombreABuscar !== '' || this.etapaABuscar !== '') {
      return true;
    }
    return false;
  }

  getEtapaArbitral(id: number): string {
    this.loading = true;
    const response = this.etapasArbitrales.find(etapa => etapa.etapaArbitralId === id)?.nombre;
    setTimeout(() => {
    }, 500);
    this.loading = false;
    return response;
  }

  openDialog(dialogType: string, subEtapaId?: number, orden?: string) {
    this.limpiarInput();
    switch (dialogType) {
      case 'new': {
        this.dialogTitle = 'Nuevo Registro';
        this.newSubEtapaForm.reset();
        this.subEtapa = {};
        break;
      }
      case 'edit': {
        this.dialogTitle = 'Editar Registro';
        this.subEtapa = {...this.subEtapas.find(subEtapa => subEtapa.subEtapaArbitralId === subEtapaId)};
        this.etapaArbitral = this.subEtapa.etapaArbitralId
        this.newSubEtapaForm.setValue({
          nombre: this.subEtapa.nombre,
          etapaArbitral: this.etapaArbitral,
          orden: orden,
          fechaCreacion: ''
        });
        break;
      }
      case 'view': {
        this.dialogTitle = 'Ver Registro';
        this.subEtapa = {...this.subEtapas.find(subEtapa => subEtapa.subEtapaArbitralId === subEtapaId)};
        this.etapaArbitral = this.subEtapa.etapaArbitralId
        this.newSubEtapaForm.setValue({
          nombre: this.subEtapa.nombre,
          etapaArbitral: this.etapaArbitral,
          orden: orden,
          fechaCreacion: new Date(this.subEtapa.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(",","")
        });
        break;
      }
    }
    this.operationType = dialogType;
    this.subEtapadDialog = true;
  }

  deleteSubEtapa(subEtapaId: number) {
    this.subEtapaID = subEtapaId;
    this.deleteSubEtapaDialog = true;
  }

  hideDialog() {
    this.subEtapadDialog = false;
    this.newSubEtapaForm.reset();
  }

  hideDeleteSubEtapaDialog() {
    this.deleteSubEtapaDialog = false;
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
      nombre: this.newSubEtapaForm.get('nombre')?.value.trim(),
      etapaArbitralId: this.newSubEtapaForm.get('etapaArbitral')?.value,
      orden: this.newSubEtapaForm.get('orden')?.value,
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    };

    this.newSubEtapaSubscription = this.subEtapaService.save({
      etapaArbitralId: this.newSubEtapa.etapaArbitralId,
      nombre: this.newSubEtapa.nombre,
      orden: this.newSubEtapa.orden,
      auditUsuarioCreacion: Utils.obtenerNombreUser()
    }).subscribe({
      next: (resp: SubArbitrajeResponse) => {
        this.messageService.add({ key: 'toast', severity: 'success', summary: 'Exito', detail: 'Se guardó el registro satisfactoriamente', life: 3000 });
        this.search();
    
      },
      error: (err: any) => {
      }
    });

    this.subEtapadDialog = false;
    this.newSubEtapaForm.reset();
  }

  deleteRecord() {

    this.deleteSubEtapaSubscription = this.subEtapaService.delete({
      auditUsuarioModifica: Utils.obtenerNombreUser(),
      subEtapaArbitralId: this.subEtapaID
    }).subscribe({
      next: (resp: SubArbitrajeResponse) => {
        this.cleanFields();
        this.search();
      },
      error: (err) => {
      }
    });
    this.deleteSubEtapaDialog = false;
  }

  updateRecord() {
    this.newSubEtapa = {
      nombre: this.newSubEtapaForm.get('nombre')?.value.trim(),
      etapaArbitralId: this.newSubEtapaForm.get('etapaArbitral')?.value,
      orden: this.newSubEtapaForm.get('orden')?.value,
      subEtapaArbitralId: this.subEtapa.subEtapaArbitralId,
      auditUsuarioModifica: Utils.obtenerNombreUser()
    };

    this.editSubEtapaSubscription = this.subEtapaService.update(this.newSubEtapa).subscribe({
      next: (resp: SubArbitrajeResponse) => {
        this.messageService.add({ key: 'toast', severity: 'success', summary: 'Éxito', detail: 'Se actualizó el registro satisfactoriamente', life: 3000 });
        this.search();
      },
      error: (err: any) => {
      }
    });

    this.subEtapadDialog = false;
    this.newSubEtapaForm.reset();
  }

  invalidField(field: string) {
    return this.newSubEtapaForm.get(field)?.invalid && this.newSubEtapaForm.get(field)?.touched;
  }

  invalidComboField(field: string) {
    return this.newSubEtapaForm.get(field)?.invalid;
  }

  cleanFields() {
    this.nombreABuscar = '';
    this.etapaABuscar = '';
    this.search();
  }

  onNameSearchChange() {
    this.nombreABuscar = this.validatorService.onInputChange(this.nombreABuscar);
  }

  onEtapaSearchChange() {
    this.etapaABuscar = this.validatorService.onInputChange(this.etapaABuscar);
  }

  ngOnDestroy(): void {
    this.subEtapaSubscription?.unsubscribe();
    this.newSubEtapaSubscription?.unsubscribe();
    this.deleteSubEtapaSubscription?.unsubscribe();
    this.editSubEtapaSubscription?.unsubscribe();
    this.etapaSubscription?.unsubscribe();
  }
}
