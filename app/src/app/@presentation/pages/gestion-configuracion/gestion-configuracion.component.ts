import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { SubscriptionLike } from 'subsink/dist/subsink';
import { ConfiguracionService } from 'src/app/@data/services/configuracion.service';
import { Configuracion } from 'src/app/@data/model/configuracion';
import { MessageService } from 'primeng/api';
import { Utils } from 'src/app/util/utils';

@Component({
  selector: 'app-gestion-configuracion',
  templateUrl: './gestion-configuracion.component.html',
  styleUrls: ['./gestion-configuracion.component.scss']
})
export class GestionConfiguracionComponent implements OnInit, OnDestroy {

  private readonly subSink = new SubSink();
  optionsPaginated: number[] = Utils.optionsPaginated;
  frmConfiguracion: FormGroup;
  submitted = false;

  configuracion!: Configuracion;

  constructor(
    private fb: FormBuilder,
    private configuracionService: ConfiguracionService,
    private messageService: MessageService) {

    this.frmConfiguracion = this.fb.group({
      configuracionId: [null, Validators.required],
      concepto: [null],
      sistemaId: [null, Validators.required],
      sistemaVersion: [null, Validators.required],
      repositorio: [null, Validators.required],
      tipoDocumento: [null, Validators.required],
      tipoImagen: [null, Validators.required],
      tamanioDocumento: [null, Validators.required],
      tamanioImagen: [null, Validators.required],
      webServicioSeguridad: [null, Validators.required],
      webServicioPide: [null],
      ldapUrl: [null],
      ldapDominio: [null],
      smtpHost: [null],
      activo: [null],
      limiteDocumento: [null],
      limiteImagen: [null],
      limiteFila: [null],
      rutaLogo: [null],
      rutaLogoRelativo: ['0', Validators.required],
      auditFechaCreacion: [null],
      auditUsuarioModifica: [null],
      auditFechaModifica: [null]
    });
    this.frmConfiguracion.disable();
  }

  ngOnInit(): void {
    this.subSink.add(this.getDataConfig())
   
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  resetForm() {
    this.frmConfiguracion.disable();
    this.submitted = false;
    this.subSink.add(this.getDataConfig())

  }


  get f() {
    return this.frmConfiguracion.controls;
  }

  update() {
    this.submitted = true;
    if (this.frmConfiguracion.valid) {
      let request: Configuracion = this.frmConfiguracion.value;
      request.auditUsuarioModifica = Utils.obtenerNombreUser();
      this.subSink.add(
        this.configuracionService.update(request)
          .subscribe(
            {
              next: (res) => {
                this.messageService.add({ key: 'toast', severity: 'success', summary: 'Exito', detail: res.mensaje, life: 3000 });
                this.resetForm();
                this.loadConfig();
              },
              error: (error: any) => {
              },
            })
      )

    }
  }

  loadConfig() {
    this.configuracionService.loadConfigReload();
  }

  initUpdate() {
    this.frmConfiguracion.enable();
    this.frmConfiguracion.get('sistemaId').disable();
  }

  getDataConfig(): SubscriptionLike {
    let subl: SubscriptionLike =
      this.configuracionService.getConfigDefault()
        .subscribe({
          next: (res) => {
            this.configuracion = res.data;
            this.frmConfiguracion.setValue(this.configuracion)
            if (!Utils.optionsPaginated.includes(this.configuracion.limiteFila)) {
              console.log("ENTRA IF")
              this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Verifique la configuración de Cant. Registros de una grilla` });
            }
          },
          error: (error: any) => {
          },
        });
    return subl;
  }

  validLoadFields() {

  }

  cancel() {
    this.resetForm();
  }

}
