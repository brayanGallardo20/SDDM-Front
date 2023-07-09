import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SubscriptionLike } from 'rxjs';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { InstitutionResponse } from 'src/app/@data/model/institution-response.model';
import { InstitucionBusquedaRequest } from 'src/app/@data/model/request/insititucion-busqueda-request';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';
import { Const } from 'src/app/@data/services/const';
import { InstitutionService } from 'src/app/@data/services/institution-service';
import { validPattern } from 'src/app/util/general';
import { Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { Constants } from '../../shared/helper/constants';

@Component({
  selector: 'mant-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.scss',
    '../shared-component-styles.scss']
})
export class InstitutionComponent implements OnInit {
  
  configuraciones:Configuracion;
  nombreABuscar: string = '';
  rucABuscar: string = '';
  cantidadPorPagina: number = Constants.cantidadPorPagina;
  private readonly subSink = new SubSink();
  institutionList: InstitutionResponse[];
  tipoOperadorArbitralId: number;
  totalRegistros: number;
  optionsPaginated:number[] =Utils.optionsPaginated;
  tipoInstitution:string = '';
  deleteDialog: boolean = false;
  institutionIdDelete;

  labelInstitution: string = '';
  constructor(private messageService: MessageService,
    private institutionService: InstitutionService,
    private configuracionService:ConfiguracionService,
    private router: Router) {
      this.configuraciones =  this.configuracionService.configuracion
      this.cantidadPorPagina = this.configuraciones.limiteFila
  }
 
  ngOnInit() {
    var urlCompelto = this.router.url.split("/");
    this.tipoInstitution = urlCompelto[urlCompelto.length - 1];
    this.tipoOperadorArbitralId = Utils.obtenerIdOperadorArbitral(this.tipoInstitution);
    this.labelInstitution = Utils.obtenerLabelOperadorArbitral(this.tipoInstitution);
    this.search();
  }

  search(first?: number, tipoCarga?: number) {
    let requestBusqueda: InstitucionBusquedaRequest = new InstitucionBusquedaRequest();
    requestBusqueda.razonSocial = this.nombreABuscar;
    requestBusqueda.ruc = this.rucABuscar;
    requestBusqueda.cantidadPorPagina = this.cantidadPorPagina;
    requestBusqueda.tipoOperadorArbitralId = this.tipoOperadorArbitralId;
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
      // this.loading = true
      let subl: SubscriptionLike =
        this.institutionService.listAll(requestBusqueda)
          .subscribe({
            next: (res) => {
              this.institutionList = res.data;
            },
            error: (error: any) => {
              if (error.status === 400) {
                this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
              } else if (error.status === 500) {
                this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.statusText}` });
              }
            },
          });
      return subl;
    }

  validateSearch(): boolean {
    if ( this.nombreABuscar !== '' || this.rucABuscar !== '') {
      return true;
    }
    return false;
  }

  onKeySoloNumeros(f: KeyboardEvent) {
    return validPattern(f, /^((^\(\+[0-9]+\))*[0-9-,]*)*$/);
  }

  cleanFields() {
    this.nombreABuscar = '';
    this.rucABuscar = '';
    this.search();
  }

  edit(institutionId) {
    this.router.navigate(['pages/mant-inst-pub-crud/'+this.tipoInstitution+'/edit/'+institutionId]);
  }

  new() {
    this.router.navigate(['pages/mant-inst-pub-crud/'+this.tipoInstitution+'/new/0']);
  }

  see(institutionId) {
    this.router.navigate(['pages/mant-inst-pub-crud/'+this.tipoInstitution+'/view/'+institutionId]);
  }

  delete(institutionId) {
    this.institutionIdDelete = institutionId;
    this.deleteDialog = true;
  }

  deleteRecord() {
    this.institutionService.delete(this.institutionIdDelete).subscribe({
      next: (resp: any) => {
        this.cleanFields();
        this.search();
      },
      error: (err) => {
      }
    });
  this.deleteDialog = false;
  }
}
