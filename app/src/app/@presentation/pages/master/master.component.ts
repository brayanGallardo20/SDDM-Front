import { Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Params } from '@angular/router';
import { Table } from 'primeng/table';
import { Master } from 'src/app/@data/model/Master';
import { MasterService } from 'src/app/@data/services/master.service';
import { opciones, Utils } from 'src/app/util/utils';
import { MasterBusquedaRequest } from 'src/app/@data/model/request/master-busqueda-request';
import { SubSink } from 'subsink';
import { SubscriptionLike } from 'subsink/dist/subsink';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorService } from '../../../@data/services/validator.service';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';

@Component({
  selector: 'centro-arbitraje-arbitros-parametry',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss',
    '../shared-component-styles.scss']
})
export class MasterComponent implements OnInit {
  configuraciones:Configuracion;
  nombreTabla: string = '';
  @ViewChild('dt') table: Table;
  @ViewChild('filter') filter: ElementRef;
  master: Master[];
  masterOrginal: Master[];
  masterModel: Master;
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  representatives: any[];
  masterDialog: boolean = false;
  seeMasterDialog: boolean = false;
  deleteMasterDialog: boolean = false;
  isNew: boolean = false;
  descripcionCrud: string;
  descripcionLabel: string;
  nameSearch: string = '';
  descripcionLabelTabla: string = '';
  descripcionLabelSearch: string = '';
  title: string = '';
  cantidadPorPagina:number;
  totalRegistros: number;
  masterForm!: FormGroup;
  maxChars: number = 0;
  optionsPaginated:number[] =Utils.optionsPaginated;

  private readonly subSink = new SubSink();

  constructor(private messageService: MessageService,
    private masterService: MasterService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private readonly configuracionService:ConfiguracionService
  ) {
    this.configuraciones =  this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila
  }
  
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.nombretabla) {
        this.nombreTabla = params.nombretabla;
        this.descripcionCrud = Utils.obtenerNombreTabla(this.nombreTabla);
        this.descripcionLabel = Utils.obtenerNombreLabel(this.nombreTabla);
        this.descripcionLabelTabla = Utils.obtenerNombreLabelTabla(this.nombreTabla);
        this.descripcionLabelSearch =  Utils.obtenerNombreLabelSearch(this.nombreTabla);
        this.loading = false;
        switch (this.nombreTabla) {
          case 'MAE_ESTADO_ARBITRAL':
            this.maxChars = 50;
            break;
          case 'MAE_TIPO_OPERADOR':
            this.nombreTabla = 'MAE_TIPO_OPERADOR_ARBITRAL';
            this.maxChars = 50;
            break;
          case 'MAE_TIPO_ARBITRO':
            this.maxChars = 50;
            break;
          case 'MAE_TIPO_OPERADOR_ARBITRAL':
            this.maxChars = 50;
            break;
        }
        this.masterForm = this.fb.group({
          name: ['', [Validators.required, Validators.maxLength(this.maxChars)]],
          creationDate: []
        });

        this.masterForm.get('name')?.valueChanges.subscribe(value => {
          if(value) {
            this.masterForm.get('name')?.setValue(value.toUpperCase(), { emitEvent: false });
          }
        });
      }
    }); 

  }
 
  list(event) {
    this.search(event.first) 
  }
 
  search(first?:number, tipoCarga?: number){
    let requestBusqueda:MasterBusquedaRequest = new MasterBusquedaRequest();
    requestBusqueda.nombre= this.nameSearch.trim();
    requestBusqueda.tablaMaestra = this.nombreTabla;
    requestBusqueda.cantidadPorPagina =this.cantidadPorPagina;

    if (tipoCarga === 2) {

      if (!this.validateSearch(requestBusqueda)) {
        this.messageService.add({ key: 'toast', severity: 'warn', summary: `Atención`, detail: 'Ingresar por lo menos un filtro de búsqueda' });
        return;
      }
    }
    if (first) requestBusqueda.filaInicio = first 
    this.subSink.add(this.listAll(requestBusqueda))
  } 
 
  
  validateSearch(requestBusqueda: MasterBusquedaRequest): boolean {
    if (requestBusqueda.nombre !== undefined && requestBusqueda.nombre !== '') {
      return true;
    }
    return false;
  }

  listAll(requestBusqueda:MasterBusquedaRequest):SubscriptionLike{
    this.loading = true
    let subl: SubscriptionLike =
      this.masterService.listAll(requestBusqueda)
        .subscribe({
          next: (res) => {
            this.master = res.data;
            this.totalRegistros = res.totalRegistros;
            this.loading = false
          },
          error: (error: any) => {
          },
        });
    return subl;
  }

  clean() {
    this.nameSearch = '';
    this.search();
  }
  new() {
    this.isNew = true;
    this.masterModel = new Master();
    this.masterForm.reset();
    this.masterDialog = true;
    this.title = 'Nuevo Registro';
  }

  dateFormat(date) {
      return Utils.localDateTime(date);
  }

  editMaster(typeParameter: Master) {
    this.isNew = false;
    this.masterModel = { ...typeParameter };
    this.masterForm.get('name')?.setValue(this.masterModel.nombre);
    this.masterForm.get('creationDate').setValue(this.masterModel.auditFechaCreacionFormat)
    this.masterDialog = true;
    this.title = 'Editar Registro';
  }
 
  seeMaster(typeParameter: Master) {
    this.isNew = false;
    this.masterModel = { ...typeParameter };
    this.masterForm.get('name')?.setValue(this.masterModel.nombre);
    this.masterForm.get('creationDate').setValue(new Date(this.masterModel.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(',',''));
    this.seeMasterDialog = true;

  }

  deleteMaster(typeParameter: Master) {
    this.deleteMasterDialog = true;
    this.masterModel = { ...typeParameter };
  }

  saveMaster() {
    this.masterModel.tablaMaestra = this.nombreTabla;

    if (this.isNew) { 
      this.masterModel.auditUsuarioCreacion = Utils.obtenerNombreUser();
      this.masterModel.nombre = this.masterForm.get('name')?.value.trim();
      this.masterService.insert(this.masterModel).subscribe(
        (results) => {
          this.master = results;
          this.messageService.add({ key: 'toast', severity: 'success', summary: 'Exitoso', detail: 'Se guardó el registro satisfactoriamente', life: 3000 });
          this.hideDialog();
          this.search();
        },
        (error) => {
          this.hideDialog();
        }
      );
    } else {
      this.masterModel.auditUsuarioModifica = Utils.obtenerNombreUser();
      this.masterModel.auditUsuarioCreacion =  null;

      this.masterModel.nombre = this.masterForm.get('name')?.value.trim();

      this.masterService.update(this.masterModel).subscribe(
        (results) => {
          this.master = results;
          this.messageService.add({ key: 'toast', severity: 'success', summary: 'Exitoso', detail: 'Se actualizó el registro satisfactoriamente', life: 3000 });
          this.hideDialog();
          this.search();
        },
        (error) => {
          this.hideDialog();
        }
      );
    }
  }

  hideDialog() {
    this.masterDialog = false;
    this.masterForm.reset();
  }

  hideDeleteDialog() {
    this.deleteMasterDialog = false;
  }

  confirmDelete() {
    this.masterModel.tablaMaestra = this.nombreTabla;
    this.masterModel.tablaMaestra = this.nombreTabla;

    this.masterService.delete(this.masterModel.tablaMaestra,this.masterModel.maestraId).subscribe(
      (results) => { 
         this.hideDeleteDialog();   
         this.search();  
        },
      (error) => {
        this.hideDeleteDialog();
      }
    );
  }

  invalidField(field: string) {
    return this.masterForm.get(field)?.invalid;
  }

  onNameSearchChange() {
    this.nameSearch = this.validatorService.onInputChange(this.nameSearch);
  }
}
