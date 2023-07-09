import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Directivo } from 'src/app/@data/model/directivo';
import { DirectivoService } from 'src/app/@data/services/directivo.service';
import { TypeDocumentService } from "src/app/@data/services/type-document.service";
import { DocumentType } from "src/app/@data/model/tipo-doc";
import { PideService } from "src/app/@data/services/pide.service";
import { Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';
import { validPattern } from "src/app/util/general";

@Component({
  selector: 'app-directivo-registrar-actualizar',
  templateUrl: './directivo-registrar-actualizar.component.html',
  styleUrls: ['./directivo-registrar-actualizar.component.scss']
})
export class DirectivoRegistrarActualizarComponent implements OnInit {

  private readonly subSink = new SubSink();

  submitted = false;
  frmDirectivo: FormGroup;
  institucionId: number;
  tiposDoc: DocumentType [] = [] ;
  editLoadIni: boolean = true;
  directivoEdit:Directivo;
  disabledButtons: boolean = false;
  readOnly:boolean;
  patternNumberDocument: any;
  maxLentgh: number;
  esPide: boolean = true;
  persona: any;
  deshabilitado: boolean = true;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly messageService: MessageService,
    private fb: FormBuilder,    
    private readonly typeDocumentService: TypeDocumentService,
    private pideService: PideService,
    private readonly directivoService: DirectivoService
  ) {
    this.frmDirectivo = this.fb.group({
      institucionId: [null],
      nombre: [null, Validators.required],
      numeroDocumento: [null, Validators.required],
      apellidoPaterno: [null, Validators.required],
      apellidoMaterno: [null],
      tipoDocumentoId: [null, Validators.required],
      institucionPersonaId: [null],
      auditUsuarioCreacion:[null], 
      auditFechaCreacionFormat:[null]
    });
    this.listTypeDocument();
    this.validateSpacesWhiteAndUpper('nombre');
    this.validateSpacesWhiteAndUpper('apellidoPaterno');
    this.validateSpacesWhiteAndUpper('numeroDocumento');
    this.institucionId = this.config.data.institucionId;
    this.readOnly = this.config.data.readOnly
    this.directivoEdit = this.config.data.directivo 
    setTimeout(() => {
      if (this.directivoEdit != null) {
        this.mapDirectivoToForm()
      }    
    }, 1000);
  }

  selectTypeDocument($event) {

    this.patternNumberDocument = $event.value.formato;
    this.maxLentgh = $event.value.numeroCaracteres;
    let pide = $event.value.pide;
    this.frmDirectivo
      .get("numeroDocumento")
      .setValidators([Validators.pattern(this.patternNumberDocument)]);
    this.frmDirectivo.controls["numeroDocumento"].setValue("");
    this.frmDirectivo.controls["numeroDocumento"].enable();
    this.frmDirectivo.controls["numeroDocumento"].updateValueAndValidity();
    this.esPideF(pide);
    this.emptyFieldsPerson();
  }

  emptyFieldsPerson() {
    this.frmDirectivo.controls["apellidoPaterno"].setValue("");
    this.frmDirectivo.controls["apellidoMaterno"].setValue("");
    this.frmDirectivo.controls["nombre"].setValue("");
  }

  enableFieldsPerson() {
    this.frmDirectivo.controls['apellidoPaterno'].enable();
    this.frmDirectivo.controls['apellidoMaterno'].enable();
    this.frmDirectivo.controls['nombre'].enable();
  }

  disabledFieldsPerson() {
    this.frmDirectivo.controls['apellidoPaterno'].disable();
    this.frmDirectivo.controls['apellidoMaterno'].disable();
    this.frmDirectivo.controls['nombre'].disable();
  }
  
  invalidField(field: string) {
    return this.frmDirectivo.get(field)?.invalid;
  }
  
  onKeyNumeroDocumento(f: KeyboardEvent) {
    return validPattern(f, this.patternNumberDocument);
  }

  buscarPide() {
    let numeroDocumento = this.frmDirectivo.get("numeroDocumento")?.value;

    this.pideService.findNaturalPerson(numeroDocumento).subscribe({
      next: (res) => {
        this.persona = res.data;
        if (this.persona) {
          this.frmDirectivo.controls["apellidoPaterno"].setValue(
            this.persona.apellidoPaterno
          );
          this.frmDirectivo.controls["apellidoMaterno"].setValue(
            this.persona.apellidoMaterno
          );
          this.frmDirectivo.controls["nombre"].setValue(
            this.persona.nombre
          );

          this.frmDirectivo.controls["numeroDocumento"].disable();
          this.deshabilitado = true;
        } else {
          this.messageService.add({ key: 'toast',severity: 'warn', summary: 'Atención', detail: res.mensaje,life:5000});
          this.emptyFieldsPerson();
          this.deshabilitado = false;
        }
      },
      error: (error: any) => {    
      },
    });
  }

  buscarPideSunat() {
    let numeroDocumento = this.frmDirectivo.get("ruc")?.value;

    this.pideService.findLegalPerson(numeroDocumento).subscribe({
      next: (res) => {
        this.persona = res.data;
        if (this.persona) {
          this.frmDirectivo.controls["razonSocial"].setValue(
            this.persona.razonSocial
          );
        }
      },
      error: (error: any) => {    
      },
    });
  }

  esPideF(pide) {
    if(pide == 1) {
      this.esPide = false;
      this.deshabilitado = true;
    } else {
      this.esPide = true;
      this.deshabilitado = false;
    }
  }

  mapDirectivoToForm() {
    this.frmDirectivo.patchValue({
      institucionPersonaId: this.directivoEdit.institucionPersonaId,
      personaNaturalId: (this.directivoEdit.personaNaturalId != null && this.directivoEdit.personaNaturalId !== undefined) ? this.directivoEdit.personaNaturalId : null,
      institucionId: (this.directivoEdit.institucionId != null && this.directivoEdit.institucionId !== undefined) ? this.directivoEdit.institucionId : null,
      tipoDocumentoId: (this.directivoEdit.tipoDocumentoId != null && this.directivoEdit.tipoDocumentoId !== undefined) ? this.setTipodocumento(this.directivoEdit.tipoDocumentoId) : null,
      nombre: (this.directivoEdit.nombre != null && this.directivoEdit.nombre !== undefined) ? this.directivoEdit.nombre : null,
      apellidoPaterno: (this.directivoEdit.apellidoPaterno != null && this.directivoEdit.apellidoPaterno !== undefined) ? this.directivoEdit.apellidoPaterno : null,
      apellidoMaterno: (this.directivoEdit.apellidoMaterno != null && this.directivoEdit.apellidoMaterno !== undefined) ? this.directivoEdit.apellidoMaterno : null,
      numeroDocumento: (this.directivoEdit.numeroDocumento != null && this.directivoEdit.numeroDocumento !== undefined) ? this.directivoEdit.numeroDocumento : null,
      auditUsuarioCreacion: (this.directivoEdit.auditUsuarioCreacion != null && this.directivoEdit.auditUsuarioCreacion !== undefined) ? this.directivoEdit.auditUsuarioCreacion : null,
      auditFechaCreacionFormat: (this.directivoEdit.auditFechaCreacionFormat != null && this.directivoEdit.auditFechaCreacionFormat !== undefined) ? this.directivoEdit.auditFechaCreacionFormat : null,
    })
    // 2. Asignamos los valores desagregados
    let numDocumento = this.directivoEdit.tipoDocumentoId;

    if (numDocumento != 463){
      if(this.readOnly){
        this.deshabilitado = true;
      } else {
        this.deshabilitado = false;
      }
    } else {
      this.deshabilitado = true;
    }

    if(this.readOnly){
      this.esPide = true;
    } else {
      if (numDocumento != 463){
        this.esPide = true;
      } else {
        this.esPide = false;
      }
    }

  }

  listTypeDocument() 
  {
    this.typeDocumentService.listAllView().subscribe({
      next: (res) => {
        this.tiposDoc = res.data;
      },
      error: (error: any) => {},
    });
  }

  // isSaveOrUpdate => 1→Save  2→Update
  mapFormToDirectivo(valueForm: any): Directivo {
    let directivoGenerated: Directivo = new Directivo();
    directivoGenerated.institucionPersonaId = valueForm.institucionPersonaId;
    directivoGenerated.institucionId = valueForm.institucionId;
    directivoGenerated.personaNaturalId = valueForm.personaId;
    directivoGenerated.nombre =  (valueForm.nombre && valueForm.nombre.trim()!=='')?valueForm.nombre:null;
    directivoGenerated.apellidoMaterno = valueForm.apellidoMaterno;
    //directivoGenerated.apellidoPaterno = valueForm.apellidoPaterno;
    directivoGenerated.apellidoPaterno =  (valueForm.apellidoPaterno && valueForm.apellidoPaterno.trim()!=='')?valueForm.apellidoPaterno:null;
    //directivoGenerated.numeroDocumento = valueForm.numeroDocumento;
    directivoGenerated.numeroDocumento = this.frmDirectivo.get('numeroDocumento').value;
    directivoGenerated.tipoDocumentoId = valueForm.tipoDocumentoId;

    return directivoGenerated;
  }

  ngOnInit(): void {
    this.initData();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();

    if (this.ref) {
      this.ref.close();
    }
  }

  get f() {
    return this.frmDirectivo.controls;
  }

  initData() {
    if(this.directivoEdit){
      //this.lodadDocumentype(463);
    }
  }

  validateSpacesWhiteAndUpper(control:string){
    this.frmDirectivo.get(control).valueChanges.subscribe((value) => {
      if (value != null) {
          if(value.trim()===''){
            this.frmDirectivo.patchValue( {[control]:null} )
          }else{
            this.frmDirectivo.get(control)?.patchValue(value.toUpperCase(), { emitEvent: false });
          }
      }
    });
  }

  setTipodocumento(tipoDocumentoId : number) : DocumentType {
    let documentType : DocumentType;
    
    if (this.editLoadIni) {
      documentType = this.tiposDoc.filter(x => x.tipoDocumentoId === tipoDocumentoId)[0];
      return documentType;
      //const departamentoCod = this.ubigeoId.substring(0, 2);
      //let departamentoSeleccionar = this.listTypeDocument.   .find(x => x.tipoDocumentoId === 463);
      //let tipoDoc = this.tiposDoc.find(x => x.tipoDocumentoId === 463);
      //this.frmDirectivo.get('tipoDocumentoId').setValue(463);    
      //this.frmDirectivo.controls["tipoDocumentoId"].setValue(tipoDoc);  
      //this.frmDirectivo.controls["tipoDocumentoId"].updateValueAndValidity();
    } else {
      return null;
    }
  }

    disabledAllInput() {

    this.disabledButtons = true;  
    this.frmDirectivo.controls['numeroDocumento'].disable();
    this.frmDirectivo.controls['apellidoPaterno'].disable();
    this.frmDirectivo.controls['apellidoMaterno'].disable();
    this.frmDirectivo.controls['nombre'].disable();
    this.frmDirectivo.controls['tipoDocumentoId'].disable();

    /*if(this.typeTransaction == 'view') {
      this.frmDirectivo.controls['usuarioCreacion'].disable();
      this.frmDirectivo.controls['fechaCreacion'].disable();
    }*/

  }

  saveUpdate() {
    this.submitted = true;
    if (this.frmDirectivo.valid) {
      let directivo: Directivo = new Directivo();
      directivo = this.mapFormToDirectivo(this.frmDirectivo.value);
      if (directivo.institucionPersonaId == null) {
        this.save(directivo)
      } else {
        this.udpate(directivo)
      }

    }
  }

  save(directivo: Directivo) {
    directivo.auditUsuarioCreacion = Utils.obtenerNombreUser()
    directivo.institucionId = this.institucionId;
    directivo.tipoDocumentoId = this.frmDirectivo.get("tipoDocumentoId")?.value.tipoDocumentoId,
    this.subSink.add(this.directivoService.insert(directivo).subscribe(
      {
        next: (res) => {
          this.ref.close(res);
        },
        error: (error: any) => {
        },
      }
    )
    )
  }
  udpate(directivo: Directivo) {
    directivo.auditUsuarioModifica = Utils.obtenerNombreUser()
    directivo.institucionId = this.institucionId;
    directivo.tipoDocumentoId = this.frmDirectivo.get("tipoDocumentoId")?.value.tipoDocumentoId,
    this.subSink.add(this.directivoService.update(directivo).subscribe(
      {
        next: (res) => {
          this.ref.close(res);
        },
        error: (error: any) => {
        },
      }
    )
    )
  }

  cancel() {
    this.ref.close();
  }

}
