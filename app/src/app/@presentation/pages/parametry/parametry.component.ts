import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SubscriptionLike } from 'rxjs';
import { Parameter } from 'src/app/@data/model/Parameter';
import { ParameterBusquedaRequest } from 'src/app/@data/model/request/parameter-busqueda-request';
import { ParameterService } from 'src/app/@data/services/parameterservice';
import { opciones, Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';

@Component({
  selector: 'centro-arbitraje-arbitros-parametry',
  templateUrl: './parametry.component.html',
  styleUrls: ['./parametry.component.scss',
'../shared-component-styles.scss']
})
export class ParametryComponent implements OnInit {

  parameter: Parameter[]=[];
  configuraciones: Configuracion;
  parameterModel: Parameter;

  optionsPaginated: number[] = Utils.optionsPaginated;

  first: number = 0;
  last: number = 0;
  cantidadPorPagina: number;
  loading: boolean = true;

  parameterDialog: boolean = false;

  seeParameterDialog: boolean = false;

  deleteParameterDialog: boolean = false;

  isType: boolean = false;

  nameSearch: string = '';

  title: string = '';


  private readonly subSink = new SubSink();

  totalRegistros: number;

  newParameterForm: FormGroup = this.fb.group({
    parametroId: [null],
    concepto: ['', [Validators.required, Validators.maxLength(50)]],
    detalle: ['', [Validators.required, Validators.maxLength(150)]],
    valor: ['', [Validators.required, Validators.maxLength(50)]],
    fechaCreacion: ['']
  });
 
  constructor(
    private fb: FormBuilder,
    private parameterService: ParameterService,
    private messageService: MessageService,
    private configuracionService:ConfiguracionService
  ) {
    this.configuraciones = this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila

  }

  ngOnInit(): void {
    this.search(null);
    this.loading = false;

  }

  get concepto () {
    return this.newParameterForm.get('concepto');
  }

  get detalle () {
    return this.newParameterForm.get('detalle');
  }

  get valor () {
    return this.newParameterForm.get('valor');
  }
 
   search(first?: number, tipoCarga?: number) {
    let requestBusqueda: ParameterBusquedaRequest = new ParameterBusquedaRequest();
    requestBusqueda.concepto = this.nameSearch.trim();
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
      this.parameterService.listAll(requestBusqueda)
        .subscribe({
          next: (res) => {
            this.parameter = res.data;
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
    if ( this.nameSearch !== '') {
      return true;
    }
    return false;
  }

  clean() {
    this.nameSearch = '';
    this.search();
  }
 
  editParameter(parameter: Parameter) {
    this.isType = false;
    this.title = 'Editar Registro';
    this.newParameterForm.setValue({
      parametroId: parameter.parametroId,
      concepto:  parameter.concepto, 
      detalle: parameter.detalle,
      valor: parameter.valor,
      fechaCreacion: ''
    });

    this.newParameterForm.enable();

    this.parameterDialog = true;

  }

  seeParameter(parameter: Parameter) {
    this.isType = true;
    this.title = 'Ver Registro';
    this.newParameterForm.setValue({
      parametroId:  parameter.parametroId,
      concepto:  parameter.concepto, 
      detalle: parameter.detalle,
      valor: parameter.valor,
      fechaCreacion: new Date(parameter.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(",", "")
    });
    // this.newParameterForm.get('first').enable()
    this.newParameterForm.disable();
    this.parameterDialog = true;
  }

  deleteParameter(typeParameter: Parameter) {
    this.deleteParameterDialog = true;
    this.parameterModel = { ...typeParameter };
  }

  saveParameter() {
       var parameterUpdate = {
        valor: this.newParameterForm.get('valor')?.value.trim(),
        detalle: this.newParameterForm.get('detalle')?.value.trim(),
        parametroId: this.newParameterForm.get('parametroId')?.value,
        concepto: this.newParameterForm.get('concepto')?.value.trim(),
        auditUsuarioModifica: Utils.obtenerNombreUser()
      };
  
      this.parameterService.update(parameterUpdate).subscribe(
        (results) => {
          this.parameter = results;
          this.messageService.add({ key: 'toast', severity: 'success', summary: 'Exitoso', detail: 'Se actualizó el registro satisfactoriamente', life: 3000});          
          this.hideDialog();
          this.search(null);
        },
        (error) => {
          this.hideDialog();
        }
      );
 
  }

  hideDialog() {
    this.parameterDialog = false;
  }

  hideDeleteDialog() {
    this.deleteParameterDialog = false;
  }
  
 confirmDelete() {

    this.parameterService.delete(this.parameterModel.parametroId).subscribe({
      next: (resp: any) => {
        this.hideDeleteDialog();
        this.search(null);
      },
      error: (err) => {
      }
    });
  }

}


