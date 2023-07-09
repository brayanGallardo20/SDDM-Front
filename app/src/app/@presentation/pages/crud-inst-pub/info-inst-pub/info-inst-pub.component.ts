import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ValidatorService } from "src/app/@data/services/validator.service";
import { InfoInstPubModel } from "../../../../@data/model/info-inst-pub.model";
import { opciones, Utils } from "src/app/util/utils";
import { InstPubService } from "src/app/@data/services/inst-pub.service";
import { forkJoin, Subscription } from "rxjs";
import { DocumentType } from "src/app/@data/model/tipo-doc";
import { TypeDocumentService } from "src/app/@data/services/type-document.service";
import { validPattern } from "src/app/util/general";
import { PideService } from "src/app/@data/services/pide.service";
import { UbigeoService } from "src/app/@data/services/ubigeo.service";
import { InstitutionService } from "src/app/@data/services/institution-service";

@Component({
  selector: "app-info-inst-pub",
  templateUrl: "./info-inst-pub.component.html",
  styleUrls: ["./info-inst-pub.component.scss"],
})
export class InfoInstPubComponent implements OnInit {
  departamentos: any[] = [];
  departamentoId: string;

  selectedDepartment: any;
  provincias: any[] = [];
  provinciaId: string;

  selectedProvince: any;
  distritos: any[] = [];
  distritoId: string;
  typeTransaction: string = "";

  selectedDistrict: any;
  infoInstPub: any;
  horaLVIni: Date;
  horaLVFin: Date;
  horaSabIni: Date;
  horaSabFin: Date;
  newInstPubSubs: Subscription;
  tiposDoc: DocumentType[];
  patternNumberDocument: any;
  maxLentgh: number;
  persona: any;
  esPide: boolean = true;
  disabledButtons: boolean = false;
  esHorarioLVInicioEsmayor: boolean = false;
  esHorarioLVFinEsmenor: boolean = false;

  esHorarioSabInicioEsmayor: boolean = false;
  esHorarioSabFinEsmenor: boolean = false;

  deshabilitado: boolean = true;
  tipoOperadorArbitralId: number = 1;
  dataInstitutionPersona: any;
  tipoInstitution: string = "";

  infoInstPubForm: FormGroup = this.fb.group({
    tipoDocumentoId: ["", [Validators.required]],
    numeroDocumento: ["", [Validators.required]],
    primerApellido: ["", [Validators.required, Validators.maxLength(40)]],
    segundoApellido: ["", [Validators.required, Validators.maxLength(40)]],
    nombres: ["", [Validators.required, Validators.maxLength(40)]],
    telefono: ["", [Validators.required, Validators.maxLength(13)]],
    correoElectronico: [
      "",
      [
        Validators.required,
        Validators.maxLength(40),
        Validators.pattern("^[_A-Za-z0-9-+@.]*$"),
      ],
    ],
    ruc: ["", [Validators.required, Validators.maxLength(11)]],
    razonSocial: ["", [Validators.required, Validators.maxLength(120)]],
    paginaWeb: ["", [Validators.required, Validators.maxLength(150)]],
    direccion: ["", [Validators.required, Validators.maxLength(250)]],
    telefonoInstitucion: ["", [Validators.required, Validators.maxLength(12)]],
    correoInstitution: [
      "",
      [
        Validators.required,
        Validators.maxLength(40),
        Validators.pattern("^[_A-Za-z0-9-+@.]*$"),
      ],
    ],
    departamento: ["", Validators.required],
    fechaCreacion: [null],
    usuarioCreacion: [null],
    provincia: ["", Validators.required],
    ubigeoId: ["", Validators.required],
    horarioLvIni: [null],
    horarioLvFin: [null],
    horarioSabIni: [null],
    horarioSabFin: [null],
  });
  labelInstitution: string = "";
  insitutionId;
  personaId;

  constructor(
    private fb: FormBuilder,
    private validatorService: ValidatorService,
    private router: Router,
    private messageService: MessageService,
    private instPubService: InstPubService,
    private typeDocumentService: TypeDocumentService,
    private pideService: PideService,
    private ubigeoService: UbigeoService,
    private institutionService: InstitutionService
  ) {}

  ngOnInit(): void {
    var urlCompelto = this.router.url.split("/");
    this.tipoInstitution = urlCompelto[urlCompelto.length - 3];
    this.typeTransaction = urlCompelto[urlCompelto.length - 2];
    this.insitutionId = urlCompelto[urlCompelto.length - 1];
    this.tipoOperadorArbitralId = Utils.obtenerIdOperadorArbitral(
      this.tipoInstitution
    );
    this.labelInstitution = Utils.obtenerLabelOperadorArbitral(
      this.tipoInstitution
    );

    this.infoInstPubForm.controls["horarioLvFin"].disable();
    this.infoInstPubForm.controls["horarioSabFin"].disable();

    if (this.typeTransaction == "new") {
      this.listTypeDocument();
      this.listDepartament();
    }

    if (this.typeTransaction === "edit") {
      this.loadDataInstitution(this.insitutionId);
    }

    if (this.typeTransaction == "view") {
      this.loadDataInstitution(this.insitutionId);
    }
  }

  get nombres() {
    return this.infoInstPubForm.get("numeroDocumento");
  }

  get numeroDocumento() {
    return this.infoInstPubForm.get("numeroDocumento");
  }

  get tipoDocumentoId() {
    return this.infoInstPubForm.get("tipoDocumentoId");
  }

  get primerApellido() {
    return this.infoInstPubForm.get("primerApellido");
  }

  get segundoApellido() {
    return this.infoInstPubForm.get("segundoApellido");
  }

  get telefono() {
    return this.infoInstPubForm.get("telefono");
  }

  get correoElectronico() {
    return this.infoInstPubForm.get("correoElectronico");
  }

  get correoInstitution() {
    return this.infoInstPubForm.get("correoInstitution");
  }

  get ruc() {
    return this.infoInstPubForm.get("ruc");
  }

  get razonSocial() {
    return this.infoInstPubForm.get("razonSocial");
  }

  get paginaWeb() {
    return this.infoInstPubForm.get("paginaWeb");
  }

  get telefonoInstitucion() {
    return this.infoInstPubForm.get("telefonoInstitucion");
  }

  get direccion() {
    return this.infoInstPubForm.get("direccion");
  }

  get departamento() {
    return this.infoInstPubForm.get("departamento");
  }

  get provincia() {
    return this.infoInstPubForm.get("provincia");
  }

  get ubigeoId() {
    return this.infoInstPubForm.get("ubigeoId");
  }

  get horarioLvIni() {
    return this.infoInstPubForm.get("horarioLvIni");
  }

  get horarioLvFin() {
    return this.infoInstPubForm.get("horarioLvFin");
  }

  get horarioSabIni() {
    return this.infoInstPubForm.get("horarioSabIni");
  }

  get horarioSabFin() {
    return this.infoInstPubForm.get("horarioSabFin");
  }

  listDepartament() {
    this.ubigeoService.listDepartamento().subscribe({
      next: (res) => {
        this.departamentos = res.data;
      },
      error: (error: any) => {},
    });
  }

  listarProvincia($event) {
    if ($event.value !== null) {
      let codDepto = $event.value.codigoDpto;
      this.departamentoId = codDepto;
      this.ubigeoService.listProvincia(codDepto).subscribe({
        next: (res) => {
          this.provincias = res.data;
          this.distritos = null;
        },
        error: (error: any) => {},
      });
    } else {
      this.provincias = null;
      this.distritos = null;
    }
  }

  listarDistrito($event) {
    if ($event.value !== null) {
      let codProv = $event.value.codigoProv;
      this.provinciaId = codProv;
      this.ubigeoService.listDistrito(this.departamentoId, codProv).subscribe({
        next: (res) => {
          this.distritos = res.data;
        },
        error: (error: any) => {},
      });
    } else {
      this.distritos = null;
    }
  }

  buscarPide() {
    let numeroDocumento = this.infoInstPubForm.get("numeroDocumento")?.value;

    this.pideService.findNaturalPerson(numeroDocumento).subscribe({
      next: (res) => {
        this.persona = res.data;
        if (this.persona) {
          this.infoInstPubForm.controls["primerApellido"].setValue(
            this.persona.apellidoPaterno
          );
          this.infoInstPubForm.controls["segundoApellido"].setValue(
            this.persona.apellidoMaterno
          );
          this.infoInstPubForm.controls["nombres"].setValue(
            this.persona.nombre
          );

          this.infoInstPubForm.controls["numeroDocumento"].disable();
        } else {
          this.messageService.add({
            key: "toast",
            severity: "warn",
            summary: "Los datos ingresados no existen en la PIDE",
            detail: "",
          });

          this.emptyFieldsPerson();
          this.deshabilitado = false;
        }
      },
      error: (error: any) => {},
    });
  }

  buscarPideSunat() {
    let numeroDocumento = this.infoInstPubForm.get("ruc")?.value;

    this.pideService.findLegalPerson(numeroDocumento).subscribe({
      next: (res) => {
        this.persona = res.data;
        if (this.persona) {
          this.infoInstPubForm.controls["razonSocial"].setValue(
            this.persona.razonSocial
          );
          this.disabledDataInstitution();
        }
      },
      error: (error: any) => {},
    });
  }

  disabledDataInstitution() {
    this.infoInstPubForm.controls["ruc"].disable();
    this.infoInstPubForm.controls["razonSocial"].disable();
  }

  enabledDataInstitution() {
    this.infoInstPubForm.controls["ruc"].enable();
    this.infoInstPubForm.controls["razonSocial"].enable();
  }

  emptyFieldsPerson() {
    this.infoInstPubForm.controls["primerApellido"].setValue("");
    this.infoInstPubForm.controls["segundoApellido"].setValue("");
    this.infoInstPubForm.controls["nombres"].setValue("");
  }

  emptyFieldsPersonLegal() {
    this.infoInstPubForm.controls["ruc"].setValue("");
    this.infoInstPubForm.controls["razonSocial"].setValue("");
    this.infoInstPubForm.controls["paginaWeb"].setValue("");
    this.infoInstPubForm.controls["direccion"].setValue("");
    this.infoInstPubForm.controls["telefonoInstitucion"].setValue("");
    this.infoInstPubForm.controls["departamento"].setValue("");
    this.infoInstPubForm.controls["provincia"].setValue("");
    this.infoInstPubForm.controls["ubigeoId"].setValue("");
    this.infoInstPubForm.controls["correoInstitution"].setValue("");
    this.enabledDataInstitution();
  }

  enableFieldsPerson() {
    this.infoInstPubForm.controls["primerApellido"].enable();
    this.infoInstPubForm.controls["segundoApellido"].enable();
    this.infoInstPubForm.controls["nombres"].enable();
  }

  disabledFieldsPerson() {
    this.infoInstPubForm.controls["primerApellido"].disable();
    this.infoInstPubForm.controls["segundoApellido"].disable();
    this.infoInstPubForm.controls["nombres"].disable();
  }

  onKeyNumeroDocumento(f: KeyboardEvent) {
    return validPattern(f, this.patternNumberDocument);
  }

  onKeySoloNumeros(f: KeyboardEvent) {
    return validPattern(f, /^((^\(\+[0-9]+\))*[0-9-,]*)*$/);
  }

  selectTypeDocument($event) {
    this.patternNumberDocument = $event.value.formato;
    this.maxLentgh = $event.value.numeroCaracteres;
    let pide = $event.value.pide;
    this.infoInstPubForm
      .get("numeroDocumento")
      .setValidators([Validators.pattern(this.patternNumberDocument)]);
    this.infoInstPubForm.controls["numeroDocumento"].setValue("");
    this.infoInstPubForm.controls["numeroDocumento"].updateValueAndValidity();
    this.infoInstPubForm.controls["numeroDocumento"].enable();

    this.esPideF(pide);
    this.emptyFieldsPerson();
  }

  esPideF(pide) {
    if (pide == 1) {
      this.esPide = false;
      this.deshabilitado = true;
    } else {
      this.esPide = true;
      this.deshabilitado = false;
    }
  }

  listTypeDocument() {
    this.typeDocumentService.listAllView().subscribe({
      next: (res) => {
        this.tiposDoc = res.data;
      },
      error: (error: any) => {},
    });
  }

  save() {
    
    if(this.esHorarioLVInicioEsmayor == true || this.esHorarioLVFinEsmenor == true || this.esHorarioSabInicioEsmayor == true ||
      this.esHorarioSabFinEsmenor == true ) {
        return;
      }

    if (this.typeTransaction === "edit") {
      this.updateInfoInstPub();
    }

    if (this.typeTransaction === "new") {
      this.saveInfoInstPub();
    }
  }

  onSelectHourIni(): void {
    let ini = this.infoInstPubForm.get("horarioLvIni").value;
    let fin = this.infoInstPubForm.get("horarioLvFin").value;

    if (ini != null) {
      let horaLVIni = new Date(
        Date.parse(this.infoInstPubForm.get("horarioLvIni").value)
      );

      let horaLVFin = new Date(
        Date.parse(this.infoInstPubForm.get("horarioLvFin").value)
      );

      if (horaLVIni > horaLVFin) {
        this.esHorarioLVInicioEsmayor = true;
      } 

      if (horaLVIni < horaLVFin) {
        this.esHorarioLVInicioEsmayor = false;
      }   

      this.infoInstPubForm.controls["horarioLvFin"].enable();
    }
  }

  onSelectHourFin(): void {
    let ini = this.infoInstPubForm.get("horarioLvIni").value;
    let fin = this.infoInstPubForm.get("horarioLvFin").value;

    if (fin != null) {
      let horaLVIni = new Date(
        Date.parse(this.infoInstPubForm.get("horarioLvIni").value)
      );

      let horaLVFin = new Date(
        Date.parse(this.infoInstPubForm.get("horarioLvFin").value)
      );

      if (horaLVFin > horaLVIni) {
        this.esHorarioLVFinEsmenor = false;
      } 

      if (horaLVFin < horaLVIni) {
        this.esHorarioLVFinEsmenor = true;
      } 
    }
  }

  onSelectHourSabIni(): void {
    let ini = this.infoInstPubForm.get("horarioSabIni").value;
    let fin = this.infoInstPubForm.get("horarioSabFin").value;

    if (ini != null) {
      let horaLVIni = new Date(
        Date.parse(this.infoInstPubForm.get("horarioSabIni").value)
      );

      let horaLVFin = new Date(
        Date.parse(this.infoInstPubForm.get("horarioSabFin").value)
      );

      if (horaLVFin > horaLVIni) {
        this.esHorarioSabInicioEsmayor = false;
      } 

      if (horaLVFin < horaLVIni) {
        this.esHorarioSabInicioEsmayor = true;
      } 

      this.infoInstPubForm.controls["horarioSabFin"].enable();
    }
  }

  onSelectHourSabFin(): void {
    let ini = this.infoInstPubForm.get("horarioSabIni").value;
    let fin = this.infoInstPubForm.get("horarioSabFin").value;

    if (fin != null) {
      let horaLVIni = new Date(
        Date.parse(this.infoInstPubForm.get("horarioSabIni").value)
      );

      let horaLVFin = new Date(
        Date.parse(this.infoInstPubForm.get("horarioSabFin").value)
      );

      if (horaLVFin < horaLVIni) {
        this.esHorarioSabFinEsmenor = true;
      } else {
        this.esHorarioSabFinEsmenor = false;
      }
    }
  }

  saveInfoInstPub(): void {
    let ubigeoGeneral = this.infoInstPubForm.get("ubigeoId")?.value;

    let horaLVIni = null;
    if (this.infoInstPubForm.get("horarioLvIni").value) {
      horaLVIni = new Date(
        Date.parse(this.infoInstPubForm.get("horarioLvIni").value)
      );
    }

    let horaLVFin = null;

    if (this.infoInstPubForm.get("horarioLvFin").value) {
      horaLVFin = new Date(
        Date.parse(this.infoInstPubForm.get("horarioLvFin").value)
      );
    }

    let horaSabIni = null;
    if (this.infoInstPubForm.get("horarioSabIni").value) {
      horaSabIni = new Date(
        Date.parse(this.infoInstPubForm.get("horarioSabIni").value)
      );
    }

    let horaSabFin = null;
    if (this.infoInstPubForm.get("horarioSabFin").value) {
      horaSabFin = new Date(
        Date.parse(this.infoInstPubForm.get("horarioSabFin").value)
      );
    }

    let persona = {
      tipoDocumentoId:
        this.infoInstPubForm.get("tipoDocumentoId")?.value.tipoDocumentoId,
      nombre: this.infoInstPubForm.get("nombres")?.value,
      apellidoPaterno: this.infoInstPubForm.get("primerApellido")?.value,
      apellidoMaterno: this.infoInstPubForm.get("segundoApellido")?.value,
      numeroDocumento: this.infoInstPubForm.get("numeroDocumento")?.value,
      correo: this.infoInstPubForm.get("correoElectronico")?.value,
      telefono: this.infoInstPubForm.get("telefono")?.value,
    };

    let institucion = {
      tipoOperadorArbitralId: this.tipoOperadorArbitralId,
      ubigeoId:
        ubigeoGeneral.codigoDpto +
        ubigeoGeneral.codigoProv +
        ubigeoGeneral.codigoDist,
      ruc: this.infoInstPubForm.get("ruc")?.value,
      razonSocial: this.infoInstPubForm.get("razonSocial")?.value,
      direccion: this.infoInstPubForm.get("direccion")?.value,
      telefono: this.infoInstPubForm.get("telefonoInstitucion")?.value,
      correo: this.infoInstPubForm.get("correoInstitution")?.value,
      paginaWeb: this.infoInstPubForm.get("paginaWeb")?.value,
      horarioLvInicio:
        horaLVIni !== null
          ? horaLVIni.getHours() + ":" + horaLVIni.getMinutes()
          : null,
      horarioLvFin:
        horaLVFin !== null
          ? horaLVFin.getHours() + ":" + horaLVFin.getMinutes()
          : null,
      horarioSaInicio:
        horaSabIni !== null
          ? horaSabIni.getHours() + ":" + horaSabIni.getMinutes()
          : null,
      horarioSaFin:
        horaSabFin !== null
          ? horaSabFin.getHours() + ":" + horaSabFin.getMinutes()
          : null,
      auditUsuarioCreacion: Utils.obtenerNombreUser(),
    };

    this.infoInstPub = {
      persona: persona,
      institucion: institucion,
    };

    this.newInstPubSubs = this.instPubService.save(this.infoInstPub).subscribe({
      next: (response: any) => {
        console.log("response:", response);
        this.messageService.add({
          key: "toast",
          severity: "success",
          summary: "Exito",
          detail: "Se guardó el registro satisfactoriamente",
          life: 1000,
        });
        setTimeout(() => {
          this.infoInstPubForm.reset();
          this.loadInfoEditPreview(response.data);

          this.instPubService.setInstitucionId(
            response.data.institucion.institucionId
          );
        }, 3000);
      },
      error: (err: any) => {
        if (err.status === 0) {
          this.messageService.add({
            key: "toast",
            severity: "error",
            summary: "Error",
            detail: `Se perdió conexión con el servidor`,
          });
        } else {
          if (err.status === 400) {
            this.messageService.add({
              key: "warn",
              severity: "warn",
              summary: `${err.error.mensaje}`,
              detail: "",
            });
          } else if (err.status === 500) {
            console.log(err);
            this.messageService.add({
              key: "toast",
              severity: "error",
              summary: "Error",
              detail: `${err.statusText}`,
            });
          }
        }
      },
    });
  }

  updateInfoInstPub(): void {
    let ubigeoGeneral = this.infoInstPubForm.get("ubigeoId")?.value;

    let horaLVIni = null;
    if (this.infoInstPubForm.get("horarioLvIni").value) {
      horaLVIni = new Date(
        Date.parse(this.infoInstPubForm.get("horarioLvIni").value)
      );
    }

    let horaLVFin = null;

    if (this.infoInstPubForm.get("horarioLvFin").value) {
      horaLVFin = new Date(
        Date.parse(this.infoInstPubForm.get("horarioLvFin").value)
      );
    }

    let horaSabIni = null;
    if (this.infoInstPubForm.get("horarioSabIni").value) {
      horaSabIni = new Date(
        Date.parse(this.infoInstPubForm.get("horarioSabIni").value)
      );
    }

    let horaSabFin = null;
    if (this.infoInstPubForm.get("horarioSabFin").value) {
      horaSabFin = new Date(
        Date.parse(this.infoInstPubForm.get("horarioSabFin").value)
      );
    }

    let persona = {
      tipoDocumentoId:
        this.infoInstPubForm.get("tipoDocumentoId")?.value.tipoDocumentoId,
      nombre: this.infoInstPubForm.get("nombres")?.value,
      apellidoPaterno: this.infoInstPubForm.get("primerApellido")?.value,
      apellidoMaterno: this.infoInstPubForm.get("segundoApellido")?.value,
      numeroDocumento: this.infoInstPubForm.get("numeroDocumento")?.value,
      correo: this.infoInstPubForm.get("correoElectronico")?.value,
      telefono: this.infoInstPubForm.get("telefono")?.value,
      personaId: this.personaId,
    };

    let institucion = {
      institucionId: this.insitutionId,
      tipoOperadorArbitralId: this.tipoOperadorArbitralId,
      ubigeoId:
        ubigeoGeneral.codigoDpto +
        ubigeoGeneral.codigoProv +
        ubigeoGeneral.codigoDist,
      ruc: this.infoInstPubForm.get("ruc")?.value,
      razonSocial: this.infoInstPubForm.get("razonSocial")?.value,
      direccion: this.infoInstPubForm.get("direccion")?.value,
      telefono: this.infoInstPubForm.get("telefonoInstitucion")?.value,
      correo: this.infoInstPubForm.get("correoInstitution")?.value,
      paginaWeb: this.infoInstPubForm.get("paginaWeb")?.value,
      horarioLvInicio:
        horaLVIni !== null
          ? horaLVIni.getHours() + ":" + horaLVIni.getMinutes()
          : null,
      horarioLvFin:
        horaLVFin !== null
          ? horaLVFin.getHours() + ":" + horaLVFin.getMinutes()
          : null,
      horarioSaInicio:
        horaSabIni !== null
          ? horaSabIni.getHours() + ":" + horaSabIni.getMinutes()
          : null,
      horarioSaFin:
        horaSabFin !== null
          ? horaSabFin.getHours() + ":" + horaSabFin.getMinutes()
          : null,
      auditUsuarioModifica: Utils.obtenerNombreUser(),
    };

    this.infoInstPub = {
      persona: persona,
      institucion: institucion,
    };

    this.newInstPubSubs = this.instPubService
      .update(this.infoInstPub)
      .subscribe({
        next: (response: any) => {
          this.messageService.add({
            key: "toast",
            severity: "success",
            summary: "Exito",
            detail: "Se actualizó el registro satisfactoriamente",
            life: 3000,
          });
          this.router.navigate([
            "pages/mant-inst-pub-crud/" +
              this.tipoInstitution +
              "/edit/" +
              this.insitutionId,
          ]);
        },
        error: (err: any) => {
          if (err.status === 0) {
            this.messageService.add({
              key: "toast",
              severity: "error",
              summary: "Error",
              detail: `Se perdió conexión con el servidor`,
            });
          } else {
            if (err.status === 400) {
              this.messageService.add({
                key: "warn",
                severity: "warn",
                summary: `${err.error.mensaje}`,
                detail: "",
              });
            } else if (err.status === 500) {
              console.log(err);
              this.messageService.add({
                key: "toast",
                severity: "error",
                summary: "Error",
                detail: `${err.statusText}`,
              });
            }
          }
        },
      });
  }

  loadDataInstitution(id) {
    this.institutionService.findIntitutionPersona(id).subscribe({
      next: (res) => {
        this.dataInstitutionPersona = res.data;
        this.loadInfoEditPreview(this.dataInstitutionPersona);
      },
      error: (error: any) => {
        if (error.status === 400) {
          this.messageService.add({
            key: "warn",
            severity: "warn",
            summary: `${error.error.mensaje}`,
            detail: error.error.detalles,
          });
        } else if (error.status === 500) {
          this.messageService.add({
            key: "toast",
            severity: "error",
            summary: "Error",
            detail: `${error.statusText}`,
          });
        }
      },
    });
  }

  loadInfoEditPreview(data) {
    this.personaId = data.persona.personaNaturalId;

    this.infoInstPubForm.controls["numeroDocumento"].setValue(
      data.persona.numeroDocumento
    );
    this.infoInstPubForm.controls["numeroDocumento"].updateValueAndValidity();

    this.infoInstPubForm.controls["primerApellido"].setValue(
      data.persona.apellidoPaterno
    );
    this.infoInstPubForm.controls["primerApellido"].updateValueAndValidity();

    this.infoInstPubForm.controls["segundoApellido"].setValue(
      data.persona.apellidoMaterno
    );
    this.infoInstPubForm.controls["segundoApellido"].updateValueAndValidity();

    this.infoInstPubForm.controls["nombres"].setValue(data.persona.nombre);
    this.infoInstPubForm.controls["nombres"].updateValueAndValidity();

    this.infoInstPubForm.controls["telefono"].setValue(data.persona.telefono);
    this.infoInstPubForm.controls["telefono"].updateValueAndValidity();

    this.infoInstPubForm.controls["correoElectronico"].setValue(
      data.persona.correo
    );
    this.infoInstPubForm.controls["correoElectronico"].updateValueAndValidity();

    this.infoInstPubForm.controls["correoInstitution"].setValue(
      data.institucion.correo
    );
    this.infoInstPubForm.controls["correoInstitution"].updateValueAndValidity();

    this.infoInstPubForm.controls["ruc"].setValue(data.institucion.ruc);
    this.infoInstPubForm.controls["ruc"].updateValueAndValidity();

    this.infoInstPubForm.controls["razonSocial"].setValue(
      data.institucion.razonSocial
    );
    this.infoInstPubForm.controls["razonSocial"].updateValueAndValidity();

    this.infoInstPubForm.controls["paginaWeb"].setValue(
      data.institucion.paginaWeb
    );
    this.infoInstPubForm.controls["paginaWeb"].updateValueAndValidity();

    this.infoInstPubForm.controls["direccion"].setValue(
      data.institucion.direccion
    );
    this.infoInstPubForm.controls["direccion"].updateValueAndValidity();

    this.infoInstPubForm.controls["telefonoInstitucion"].setValue(
      data.institucion.telefono
    );
    this.infoInstPubForm.controls[
      "telefonoInstitucion"
    ].updateValueAndValidity();

    this.infoInstPubForm.controls["telefonoInstitucion"].setValue(
      data.institucion.telefono
    );
    this.infoInstPubForm.controls[
      "telefonoInstitucion"
    ].updateValueAndValidity();

    if (data.institucion.auditFechaCreacion) {
      var date = new Date(data.institucion.auditFechaCreacion)
        .toLocaleString("es-ES", opciones)
        .replace(",", "");
      this.infoInstPubForm.controls["fechaCreacion"].setValue(date);
      this.infoInstPubForm.controls["fechaCreacion"].updateValueAndValidity();
    }

    this.infoInstPubForm.controls["usuarioCreacion"].setValue(
      data.institucion.auditUsuarioCreacion
    );
    this.infoInstPubForm.controls["usuarioCreacion"].updateValueAndValidity();

    let ubigeoGeneral = String(data.institucion.ubigeoId);

    if (ubigeoGeneral) {
      let depa = ubigeoGeneral.slice(0, 2);
      let prov = ubigeoGeneral.slice(2, 4);
      let dist = ubigeoGeneral.slice(4, 6);

      const departamento = this.ubigeoService.listDepartamento();
      const provincia = this.ubigeoService.listProvincia(depa);
      const distrito = this.ubigeoService.listDistrito(depa, prov);
      const typeDoc = this.typeDocumentService.listAllView();
      forkJoin([departamento, provincia, distrito, typeDoc]).subscribe(
        (res) => {
          this.departamentos = res[0].data;
          this.provincias = res[1].data;
          this.distritos = res[2].data;
          this.tiposDoc = res[3].data;
          let Depart = this.departamentos.filter((x) => x.codigoDpto === depa);
          let provi = this.provincias.filter((x) => x.codigoProv === prov);
          let distr = this.distritos.filter((x) => x.codigoDist === dist);

          this.lodadDocumentype(data.persona.tipoDocumentoId);
          this.loadDepartamento(Depart[0]);
          this.loadProvincia(provi[0]);
          this.loadDistrito(distr[0]);
        }
      );

      this.loadTime(
        data.institucion.horarioLvInicio,
        data.institucion.horarioLvFin,
        data.institucion.horarioSaInicio,
        data.institucion.horarioSaFin
      );
      if (this.typeTransaction === "new" || this.typeTransaction === "view") {
        this.disabledAllInput();
      }
    }
  }

  disabledAllInput() {
    this.disabledButtons = true;

    this.infoInstPubForm.controls["numeroDocumento"].disable();
    this.infoInstPubForm.controls["primerApellido"].disable();
    this.infoInstPubForm.controls["segundoApellido"].disable();
    this.infoInstPubForm.controls["nombres"].disable();
    this.infoInstPubForm.controls["telefono"].disable();
    this.infoInstPubForm.controls["correoElectronico"].disable();
    this.infoInstPubForm.controls["ruc"].disable();
    this.infoInstPubForm.controls["razonSocial"].disable();
    this.infoInstPubForm.controls["direccion"].disable();
    this.infoInstPubForm.controls["telefonoInstitucion"].disable();
    this.infoInstPubForm.controls["departamento"].disable();
    this.infoInstPubForm.controls["provincia"].disable();
    this.infoInstPubForm.controls["ubigeoId"].disable();

    this.infoInstPubForm.controls["horarioLvIni"].disable();
    this.infoInstPubForm.controls["horarioLvFin"].disable();
    this.infoInstPubForm.controls["horarioSabIni"].disable();
    this.infoInstPubForm.controls["horarioSabFin"].disable();
    this.infoInstPubForm.controls["tipoDocumentoId"].disable();
    this.infoInstPubForm.controls["paginaWeb"].disable();
    this.infoInstPubForm.controls["correoInstitution"].disable();

    if (this.typeTransaction == "view") {
      this.infoInstPubForm.controls["usuarioCreacion"].disable();
      this.infoInstPubForm.controls["fechaCreacion"].disable();
    }
  }

  loadDepartamento(depa) {
    if (depa) {
      this.infoInstPubForm.controls["departamento"].setValue(depa);
      this.infoInstPubForm.controls["departamento"].updateValueAndValidity();
    }
  }

  loadProvincia(prov) {
    if (prov) {
      this.infoInstPubForm.controls["provincia"].setValue(prov);
      this.infoInstPubForm.controls["provincia"].updateValueAndValidity();
    }
  }

  loadDistrito(dist) {
    if (dist) {
      this.infoInstPubForm.controls["ubigeoId"].setValue(dist);
      this.infoInstPubForm.controls["ubigeoId"].updateValueAndValidity();
    }
  }

  lodadDocumentype(tipoDocumentoId) {
    let tipoDoc = this.tiposDoc.filter(
      (x) => x.tipoDocumentoId === tipoDocumentoId
    );
    if (tipoDoc) {
      this.infoInstPubForm.controls["tipoDocumentoId"].setValue(tipoDoc[0]);
      this.infoInstPubForm.controls["tipoDocumentoId"].updateValueAndValidity();
      this.maxLentgh = tipoDoc[0].numeroCaracteres;
      this.esPideF(tipoDoc[0].pide);
      console.log("tipoDoc[0].formato:", tipoDoc[0].formato);
      this.infoInstPubForm
        .get("numeroDocumento")
        .setValidators([Validators.pattern(tipoDoc[0].formato)]);
      this.patternNumberDocument = tipoDoc[0].formato;
      this.infoInstPubForm.controls["numeroDocumento"].updateValueAndValidity();
    }
  }
  loadTime(lunesViernesIni, lunesViernesFin, sabadoIni, sabadoFin) {
    let arrayHoraMinLvIni = [];
    let arrayHoraMinLvFin = [];
    let arrayHoraMinSabIni = [];
    let arrayHoraMinSabFin = [];

    if (lunesViernesIni) {
      arrayHoraMinLvIni = Utils.arrayHourMin(lunesViernesIni);
    }

    if (lunesViernesFin) {
      arrayHoraMinLvFin = Utils.arrayHourMin(lunesViernesFin);
    }

    if (sabadoIni) {
      arrayHoraMinSabIni = Utils.arrayHourMin(sabadoIni);
    }
    if (sabadoFin) {
      arrayHoraMinSabFin = Utils.arrayHourMin(sabadoFin);
    }

    var today = new Date();
    var lvIni = null;
    var lvFin = null;
    var saIn = null;
    var saFin = null;

    if (arrayHoraMinLvIni.length > 0) {
      lvIni = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        arrayHoraMinLvIni[0],
        arrayHoraMinLvIni[1],
        0
      );
    }
    if (arrayHoraMinLvFin.length > 0) {
      lvFin = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        arrayHoraMinLvFin[0],
        arrayHoraMinLvFin[1],
        0
      );
    }
    if (arrayHoraMinSabIni.length > 0) {
      saIn = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        arrayHoraMinSabIni[0],
        arrayHoraMinSabIni[1],
        0
      );
    }
    if (arrayHoraMinSabFin.length > 0) {
      saFin = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        arrayHoraMinSabFin[0],
        arrayHoraMinSabFin[1],
        0
      );
    }

    this.infoInstPubForm.controls["horarioLvIni"].setValue(lvIni);
    this.infoInstPubForm.controls["horarioLvIni"].updateValueAndValidity();

    this.infoInstPubForm.controls["horarioLvFin"].setValue(lvFin);
    this.infoInstPubForm.controls["horarioLvFin"].updateValueAndValidity();

    this.infoInstPubForm.controls["horarioSabIni"].setValue(saIn);
    this.infoInstPubForm.controls["horarioSabIni"].updateValueAndValidity();

    this.infoInstPubForm.controls["horarioSabFin"].setValue(saFin);
    this.infoInstPubForm.controls["horarioSabFin"].updateValueAndValidity();
  }

  invalidField(field: string) {
    return this.infoInstPubForm.get(field)?.invalid;
  }

  goBack() {
    this.router.navigate(["pages/institution/" + this.tipoInstitution]);
  }

  OnDestroy() {
    this.newInstPubSubs?.unsubscribe();
  }
}
