import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TypeDocumentBusquedaRequest } from 'src/app/@data/model/request/type-document-busqueda-request';
import { TypeDocumentRequest } from 'src/app/@data/model/request/type-document-request';
import { DocumentType } from 'src/app/@data/model/tipo-doc';
import { TypeDocumentService } from 'src/app/@data/services/type-document.service';
import { opciones, Utils } from 'src/app/util/utils';
import { SubscriptionLike, SubSink } from 'subsink/dist/subsink';
import { ValidatorService } from '../../../@data/services/validator.service';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';
import { Configuracion } from 'src/app/@data/model/configuracion';

@Component({
  selector: 'app-maestro-tpo-doc',
  templateUrl: './maestro-tpo-doc.component.html',
  styleUrls: ['./maestro-tpo-doc.component.scss']
})
export class MaestroTpoDocComponent implements OnInit {
  configuraciones:Configuracion;
  tipoDocDialog: boolean = false
  deleteTipoDocDialog: boolean = false;
  tipoDoc: DocumentType;
  tiposDoc: DocumentType[];
  descripcion: string = '';
  pide: number = 1;
  submitted: boolean;
  operationType: string = '';
  dialogTitle: string;
  statuses: any[];
  nameSearch: string = '';
  cantidadPorPagina: number;
  private readonly subSink = new SubSink();
  loading: boolean = true;
  totalRegistros: number;
  isNew: boolean = false;
  estado: string = 'ACTIVO';
  optionsPaginated:number[] =Utils.optionsPaginated;

  constructor(
    private messageService: MessageService,
    private typeDocumentService: TypeDocumentService,
    private validatorService: ValidatorService,
    private readonly configuracionService:ConfiguracionService 
  ) { 
    this.configuraciones =  this.configuracionService.configuracion
    this.cantidadPorPagina = this.configuraciones.limiteFila
  }

  ngOnInit(): void {

  }

  openDialog(dialogType: string, tipoDocId?: number, tipoDocEdit?: DocumentType) {

    switch (dialogType) {
      case 'new': {
        this.dialogTitle = 'Nuevo Registro';
        this.tipoDoc = {};
        this.submitted = false;
        this.isNew = true;
        break;
      }
      case 'edit': {
        this.dialogTitle = 'Editar Registro';
        this.tipoDoc = { ...tipoDocEdit };
        this.submitted = false;
        this.isNew = false;
        break;
      }
      case 'view': {
        this.dialogTitle = 'Ver Registro';
        this.tipoDoc = { ...tipoDocEdit };
        this.tipoDoc.auditFechaCreacionFormat = new Date(this.tipoDoc.auditFechaCreacionFormat).toLocaleString('es-ES', opciones).replace(",","");
        this.submitted = false;
        break;
      }
    }
    this.operationType = dialogType;
    this.tipoDocDialog = true;
  }

  list(event) {
    this.search(event.first)
  }

  clean() {
    this.nameSearch = '';
    this.search();
  }

  search(first?: number, tipoCarga?: number) {
    let requestBusqueda: TypeDocumentBusquedaRequest = new TypeDocumentBusquedaRequest();
    requestBusqueda.nombre = this.nameSearch.trim();
    requestBusqueda.cantidadPorPagina = this.cantidadPorPagina;
    if (tipoCarga === 2) { 
      if (!this.validateSearch(requestBusqueda)) {
        this.messageService.add({ key: 'toast', severity: 'warn', summary: `Atención`, detail: 'Ingresar por lo menos un filtro de búsqueda' });
        return;
      }
    }

    if (first) requestBusqueda.filaInicio = first
    this.subSink.add(this.listAll(requestBusqueda))
  }

  validateSearch(requestBusqueda: TypeDocumentBusquedaRequest): boolean {
    if (requestBusqueda.nombre !== undefined && requestBusqueda.nombre !== '') {
      return true;
    }
    return false;
  }

  listAll(requestBusqueda: TypeDocumentBusquedaRequest): SubscriptionLike {
    this.loading = true
    let subl: SubscriptionLike =
      this.typeDocumentService.listAll(requestBusqueda)
        .subscribe({
          next: (res) => {
            this.tiposDoc = res.data;
            this.totalRegistros = res.totalRegistros;
            this.tiposDoc.forEach(e => e.pide === 1 ? e.pideCheckBox = true : e.pideCheckBox = false);

            this.loading = false;
          },
          error: (error: any) => {
          },
        });
    return subl;
  }

  save() {
    let requestBusqueda: TypeDocumentRequest = new TypeDocumentRequest();

    requestBusqueda.nombre = this.tipoDoc.nombre.trim()
    if (this.tipoDoc.pideCheckBox) {
      requestBusqueda.pide = 1
    } else {
      requestBusqueda.pide = 0
    }

    if (this.isNew) {
      requestBusqueda.tipoValor = 'ALF'
      requestBusqueda.auditUsuarioCreacion = Utils.obtenerNombreUser();

      this.typeDocumentService.insert(requestBusqueda).subscribe(
        (results) => {
          this.messageService.add({ key: 'toast', severity: 'success', summary: 'Exitoso', detail: 'Se guardó el registro satisfactoriamente', life: 3000 });
          this.hideDialog();
          this.search();
        },
        (error) => {
          this.hideDialog();
        }
      );
    }
    else {
      requestBusqueda.auditUsuarioModifica = Utils.obtenerNombreUser();
      requestBusqueda.tipoDocumentoId = this.tipoDoc.tipoDocumentoId

      this.typeDocumentService.update(requestBusqueda).subscribe(
        (results) => {
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


  deleteTipoDoc(tipoDocEdit: any) {
    this.tipoDoc = { ...tipoDocEdit };
    this.deleteTipoDocDialog = true;
  }

  hideDialog() {
    this.tipoDocDialog = false;
    this.submitted = false;
  }

  confirmDelete() {
    let requestBusqueda: TypeDocumentRequest = new TypeDocumentRequest();
    requestBusqueda = {}
    requestBusqueda.tipoDocumentoId = this.tipoDoc.tipoDocumentoId
    requestBusqueda.auditUsuarioModifica = Utils.obtenerNombreUser(),

      this.typeDocumentService.delete(requestBusqueda).subscribe(
        (results) => {
          this.deleteTipoDocDialog = false;
          this.search();
        },
        (error) => {
          this.deleteTipoDocDialog = false;
        }
      );
  }

  onNameSearchChange() {
    this.nameSearch = this.validatorService.onInputChange(this.nameSearch);
  }

  onInputChange(value: string) {
    return value.toUpperCase();
  }
}
