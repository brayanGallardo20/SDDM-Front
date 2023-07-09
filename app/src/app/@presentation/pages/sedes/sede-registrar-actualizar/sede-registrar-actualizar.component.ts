import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { ArbitrationMatterModel } from 'src/app/@data/model/arbitrationMatter.model';
import { Especialidad } from 'src/app/@data/model/especialidad';
import { Sede } from 'src/app/@data/model/sede';
import { SedeEspecialidad } from 'src/app/@data/model/sede-especialidad';
import { SedeMateriaArbitral } from 'src/app/@data/model/sede-materia-arbitral';
import { Ubigeo } from 'src/app/@data/model/ubigeo';
import { ArbitrationMatterService } from 'src/app/@data/services/arbitration-matter-service';
import { EspecialidadService } from 'src/app/@data/services/especialidad.service';
import { SedeService } from 'src/app/@data/services/sede.service';
import { UbigeoService } from 'src/app/@data/services/ubigeo.service';
import { Utils } from 'src/app/util/utils';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sede-registrar-actualizar',
  templateUrl: './sede-registrar-actualizar.component.html',
  styleUrls: ['./sede-registrar-actualizar.component.scss']
})
export class SedeRegistrarActualizarComponent implements OnInit {

  private readonly subSink = new SubSink();

  listadoEspecialidad: Especialidad[] = [];
  listadoMateriaArbitral: ArbitrationMatterModel[] = [];

  maxLengthNombre:number=150;
  maxLengthDireccion:number=250;
  maxLengthNroResolucion:number=150;
  maxLengthTelefono:number=12;
  maxLengthCorreo:number=100;
  

  listadoDepartamento: Ubigeo[] = [];
  listadoProvincia: Ubigeo[] = [];
  listadoDistrito: Ubigeo[] = [];
  submitted = false;
  frmSede: FormGroup;
  institucionId: number;

  ubigeoId: string;
  editLoadIni: boolean = false;
  sedeEdit:Sede;
  readOnly:boolean;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private readonly especialidadService: EspecialidadService,
    private readonly arbitrationMatterService: ArbitrationMatterService,
    private readonly ubigeoService: UbigeoService,
    private readonly sedeService: SedeService
  ) {
    this.frmSede = this.fb.group({
      sedeId: [null],
      institucionId: [null],
      nombre: [null, [Validators.required]],
      direccion: [null, Validators.required],
      numeroResolucionPartida: [null, [Validators.required]],
      telefono: [null, Validators.required],
      correo: [null, [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)] ],
      departamento: [null, Validators.required],
      provincia: [null, Validators.required],
      distrito: [null, Validators.required],
      especialidadesSeleccionadas: [null, Validators.required],
      materiaArbitralSeleccionadas: [null,Validators.required],
      auditUsuarioCreacion:[null], 
      auditFechaCreacionFormat:[null]
    });

    this.cargarProvincias();
    this.cargarDistritos();
    this.validateSpacesWhiteAndUpper('nombre');
    this.validateSpacesWhiteAndUpper('direccion');
    this.validateSpacesWhiteAndUpper('numeroResolucionPartida');
    this.validateSpacesWhiteAndUpper('telefono'); 
    this.institucionId = this.config.data.institucionId;
    this.readOnly = this.config.data.readOnly
    this.sedeEdit = this.config.data.sede 
    if (this.sedeEdit != null) {

      this.mapSedeToForm()
    }
  }

  mapSedeToForm() {
    // 1. Asignamos los valores que son tal cual    
    this.frmSede.patchValue({
      sedeId: this.sedeEdit.sedeId,
      institucionId: (this.sedeEdit.institucionId != null && this.sedeEdit.institucionId !== undefined) ? this.sedeEdit.institucionId : null,
      nombre: (this.sedeEdit.nombre != null && this.sedeEdit.nombre !== undefined) ? this.sedeEdit.nombre : null,
      direccion: (this.sedeEdit.direccion != null && this.sedeEdit.direccion !== undefined) ? this.sedeEdit.direccion : null,
      numeroResolucionPartida: (this.sedeEdit.numeroResolucionPartida != null && this.sedeEdit.numeroResolucionPartida !== undefined) ? this.sedeEdit.numeroResolucionPartida : null,
      telefono: (this.sedeEdit.telefono != null && this.sedeEdit.telefono !== undefined) ? this.sedeEdit.telefono : null,
      correo: (this.sedeEdit.correo != null && this.sedeEdit.correo !== undefined) ? this.sedeEdit.correo : null,
      departamento: null,
      provincia: null,
      distrito: null,
      auditUsuarioCreacion: (this.sedeEdit.auditUsuarioCreacion != null && this.sedeEdit.auditUsuarioCreacion !== undefined) ? this.sedeEdit.auditUsuarioCreacion : null,
      auditFechaCreacionFormat: (this.sedeEdit.auditFechaCreacionFormat != null && this.sedeEdit.auditFechaCreacionFormat !== undefined) ? this.sedeEdit.auditFechaCreacionFormat : null,

    })
    // 2. Asignamos los valores desagregados
    if (this.sedeEdit.ubigeoId != null) {
      this.ubigeoId = this.sedeEdit.ubigeoId;
      this.editLoadIni = true;
    }

  }


  // isSaveOrUpdate => 1→Save  2→Update
  mapFormToSede(valueForm: any): Sede {
    let sedeGenerated: Sede = new Sede();

    sedeGenerated.sedeId = valueForm.sedeId;
    sedeGenerated.institucionId = valueForm.institucionId;
    sedeGenerated.nombre =  (valueForm.nombre && valueForm.nombre.trim()!=='')?valueForm.nombre:null;
    sedeGenerated.direccion = valueForm.direccion;
    sedeGenerated.numeroResolucionPartida = valueForm.numeroResolucionPartida;
    sedeGenerated.telefono = valueForm.telefono;
    sedeGenerated.correo = valueForm.correo;
    sedeGenerated.ubigeoId = valueForm.departamento.codigoDpto + valueForm.provincia.codigoProv + valueForm.distrito.codigoDist

    if (valueForm.especialidadesSeleccionadas.length > 0) {
      sedeGenerated.listadoSedeEspecialidad = valueForm.especialidadesSeleccionadas.map((element) => {
        let sedeEspecialidad: SedeEspecialidad = new SedeEspecialidad();
        sedeEspecialidad.especialidadId = element.especialidadId;
        return sedeEspecialidad;
      })
    }

    if (valueForm.materiaArbitralSeleccionadas.length > 0) {
      sedeGenerated.listadoSedeMateriaArbitral = valueForm.materiaArbitralSeleccionadas.map((element) => {
        let sedeMateriaArbitral: SedeMateriaArbitral = new SedeMateriaArbitral();
        sedeMateriaArbitral.materiaArbitralId = element.materiaArbitralId;
        return sedeMateriaArbitral;
      })
    }
    return sedeGenerated;
  }

  loadEspecialidades(listadoSedeEspecialidad: SedeEspecialidad[]): Especialidad[] {
    let especialidadesSeleccionadas: Especialidad[] = []
    if (listadoSedeEspecialidad.length > 0) {
      let idsEspecialidades = listadoSedeEspecialidad.map(e => e.especialidadId);
      especialidadesSeleccionadas = this.listadoEspecialidad.filter(element =>idsEspecialidades.includes(element.especialidadId));

      if(this.readOnly){
        this.listadoEspecialidad = especialidadesSeleccionadas ;
        especialidadesSeleccionadas = especialidadesSeleccionadas.map( e=>{
          e.isDisabled=true;
          return e;
        } );
      }

    }
    return especialidadesSeleccionadas;
  }

  loadMateriasArbitrales(listadoSedeMateriaArbitral: SedeMateriaArbitral[]): ArbitrationMatterModel[] {
    let materiaArbitralSeleccionadas: ArbitrationMatterModel[] = []
    if (listadoSedeMateriaArbitral.length > 0) {
      let idsMateriaArbitral = listadoSedeMateriaArbitral.map(e => e.materiaArbitralId);
      materiaArbitralSeleccionadas = this.listadoMateriaArbitral.filter(element => idsMateriaArbitral.includes(element.materiaArbitralId));
      if(this.readOnly){
        this.listadoMateriaArbitral = materiaArbitralSeleccionadas ;
        materiaArbitralSeleccionadas = materiaArbitralSeleccionadas.map( e=>{
          e.isDisabled=true;
          return e;
        } );
      }
    }
    return materiaArbitralSeleccionadas;
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
    return this.frmSede.controls;
  }

  initData() {
    this.subSink.add(
      forkJoin([
        this.especialidadService.listChoose(),
        this.arbitrationMatterService.listChoose(),
        this.ubigeoService.getDepartamento()
      ])
        .subscribe({
          next: (res) => {
            this.listadoEspecialidad = res[0].data;
            this.listadoMateriaArbitral = res[1].data;
            this.listadoDepartamento = res[2].data;
     
            if(this.sedeEdit){
              this.setDepartamento()
              this.frmSede.patchValue({
                especialidadesSeleccionadas: this.loadEspecialidades(this.sedeEdit.listadoSedeEspecialidad),
                materiaArbitralSeleccionadas: this.loadMateriasArbitrales(this.sedeEdit.listadoSedeMateriaArbitral)
              })
            }
          },
          error: (error: any) => {
          },
        })
    )
  }

  cargarProvincias() {
    this.frmSede.get('departamento').valueChanges.subscribe((value) => {
      this.frmSede.get('distrito').setValue(null);
      if (value != null) {
        this.subSink.add(
          this.ubigeoService.getProvincia(value.codigoDpto).subscribe(
            {
              next: (res) => {
                this.listadoProvincia = res.data;
                this.setProvincia();
                
              },
              error: (error: any) => {
              },
            })
        )
      }

    })
  }

  cargarDistritos() {
    this.frmSede.get('provincia').valueChanges.subscribe((value) => {
      if (value != null) {
        console.log(value)
        this.subSink.add(this.ubigeoService.getDistrito(this.frmSede.value.departamento.codigoDpto, value.codigoProv).subscribe(
          {
            next: (res) => {
              this.listadoDistrito = res.data;
              this.setDistrito();
            },
            error: (error: any) => {
            },
          }
        )
        )
      }
    });
  }

  validateSpacesWhiteAndUpper(control:string){
    this.frmSede.get(control).valueChanges.subscribe((value) => {
      if (value != null) {
          if(value.trim()===''){
            this.frmSede.patchValue( {[control]:null} )
          }else{
            this.frmSede.get(control)?.patchValue(value.toUpperCase(), { emitEvent: false });
          }
      }
    });
  }
  
  setDepartamento() {
    if (this.editLoadIni) {
      const departamentoCod = this.ubigeoId.substring(0, 2);
      let departamentoSeleccionar = this.listadoDepartamento.find(e => e.codigoDpto === departamentoCod)
      this.frmSede.get('departamento').setValue(departamentoSeleccionar);
    }
  }

  setProvincia() {
    if (this.editLoadIni) {
      const departamentoCod = this.ubigeoId.substring(0, 2);
      const provinciaCod = this.ubigeoId.substring(2, 4);
      if (departamentoCod) {
        let provinciaSeleccionar = this.listadoProvincia.find(e => e.codigoProv === provinciaCod)
        this.frmSede.get('provincia').setValue(provinciaSeleccionar);
      } else {
        this.frmSede.get('provincia').setValue(null);
      }
    }
  }

  setDistrito() {
    if (this.editLoadIni) {
      const provinciaCod = this.ubigeoId.substring(2, 4);
      const distritoCod = this.ubigeoId.substring(4, 6);
      // Establecer el valor del control de distrito, pero solo si el control de provincia tiene un valor
      if (provinciaCod) {
        let distritoSeleccionar = this.listadoDistrito.find(e => e.codigoDist === distritoCod)
        this.frmSede.get('distrito').setValue(distritoSeleccionar);
      } else {
        this.frmSede.get('distrito').setValue(null);
      }
      this.editLoadIni=false;
    }

  }

  saveUpdate() {
    this.submitted = true;
    if (this.frmSede.valid) {
      console.log("Es valido")
      let sede: Sede = new Sede();
      sede = this.mapFormToSede(this.frmSede.value);
      if (sede.sedeId == null) {
        this.save(sede)
      } else {
        this.udpate(sede)
      }

    }
  }

  save(sede: Sede) {
    sede.auditUsuarioCreacion = Utils.obtenerNombreUser()
    sede.institucionId = this.institucionId;
    console.log(sede)
    this.subSink.add(this.sedeService.save(sede).subscribe(
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
  udpate(sede: Sede) {
    sede.auditUsuarioModifica = Utils.obtenerNombreUser()
    sede.institucionId = this.institucionId;
    console.log(sede)
    this.subSink.add(this.sedeService.update(sede).subscribe(
      {
        next: (res) => {
          console.log(res)
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
