import { UbigeoService } from './../../../../@data/services/ubigeo.service';
import { Ubigeo } from './../../../../@data/model/ubigeo';
import { Sancion } from './../../../../@data/model/sancion';
import { DeclaracionInteres } from './../../../../@data/model/declaracion-interes';
import { TipoDocumentoService } from './../../../../@data/services/tipo-documento.service';
import { TipoDocumento } from './../../../../@data/model/tipo-documento';
import { SancionService } from './../../../../@data/services/sancion.service';
import { DeclaracionInteresService } from './../../../../@data/services/declaracion-interes.service';
import { EspecialidadService } from './../../../../@data/services/especialidad.service';
import { Especialidad } from './../../../../@data/model/especialidad';
import { SubscriptionLike } from 'subsink/dist/subsink';
import { MessageService } from 'primeng/api';
import { ArbitroService } from './../../../../@data/services/arbitro.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Arbitro } from './../../../../@data/model/arbitro';
import { SubSink } from 'subsink';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin,switchMap } from 'rxjs';

@Component({
  selector: 'app-arbitro-registrar-actualizar',
  templateUrl: './arbitro-registrar-actualizar.component.html',
  styleUrls: ['./arbitro-registrar-actualizar.component.scss']
})
export class ArbitroRegistrarActualizarComponent implements OnInit,OnDestroy {


  private readonly subSink = new SubSink;

  arbitro:Arbitro = new Arbitro();

  listadoEspecialidad:Especialidad[]=[];
  listadoDeclaracionInteres:DeclaracionInteres[]=[];
  listadoTipoDocumento:TipoDocumento[]=[];
  listadoSancion:Sancion[]=[];

  tipoUbigeo:string='reniec'
  listadoDepartamento:any[]=[];
  listadoProvincia:any[]=[];
  listadoDistrito:any[]=[];
  ubigeoPorId!:any;

  departamentoSelect:any;
  provinciaSelect:any;
  distritoSelect:any;


  readOnly!:boolean;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly arbitroService:ArbitroService,
    private readonly messageService:MessageService,
    private readonly especialidadService:EspecialidadService,
    private readonly declaracionInteresService:DeclaracionInteresService,
    private readonly sancionService:SancionService,
    private readonly tipoDocumentoService:TipoDocumentoService,
    private readonly ubigeoService:UbigeoService
  ) { }

  ngOnInit(): void {
    this.readOnly = this.config.data.readOnly
    this.arbitro = this.config.data.arbitro;
 
    this.cargarFiltros();

    if(this.arbitro.arbitroId===undefined){
      this.listarUbigeo();
    }else{
      if(this.arbitro.ubigeoId==null){
        this.listarUbigeo();
      }else{
        this.listarUbigeoInverso();
      }
    }
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();

    if (this.ref) {
      this.ref.close();
    }
  }

  cargarFiltros(){
      this.subSink.add(
        this.listarFiltros()
        )
  }

  listarUbigeo(){
    // this.subSink.add(this.listarDepartamento())
  }

  listarUbigeoInverso(){
    // const obsUbigeoDistrito = this.ubigeoService.obtenerUbigeoPorId(this.tipoUbigeo,this.arbitro.ubigeoId);

    // const obsDistrito=obsUbigeoDistrito.pipe( 
    //   switchMap(   (responseUbigeo)=>{
    //     this.distritoSelect = responseUbigeo.data;
    //     return this.ubigeoService.listDistrito(this.tipoUbigeo,this.distritoSelect.ubigeoPadreId)
    //   } ))


    //   const obsUbigeoProvincia = obsDistrito.pipe( 
    //     switchMap(   (responseDistritos)=>{
    //       this.listadoDistrito =responseDistritos.data
    //       return this.ubigeoService.obtenerUbigeoPorId(this.tipoUbigeo,this.distritoSelect.ubigeoPadreId)
    //     } ))

    // const obsProvincia = obsUbigeoProvincia.pipe( 
    //   switchMap(   (responseDistritos)=>{
    //     this.provinciaSelect =responseDistritos.data
    //     return this.ubigeoService.listProvincia(this.tipoUbigeo,this.provinciaSelect.ubigeoPadreId)
    //   } ))
    //  const obsDepartamento = obsProvincia.pipe( 
    //   switchMap(   (responseProvincia)=>{
    //     this.listadoProvincia = responseProvincia.data;
    //     return this.ubigeoService.listDepartamento(this.tipoUbigeo)
    //   } ))


    //  this.subSink.add( obsDepartamento.subscribe({
    //   next: (responseDepartamento) => {
    //     this.listadoDepartamento =JSON.parse(JSON.stringify(responseDepartamento.data)); 
    //   this.departamentoSelect  =  this.listadoDepartamento.find((e)=>e.ubigeoId===this.provinciaSelect.ubigeoPadreId)
    //   },
    //   error: (error: any) => {
    //     if (error.status === 400) {
    //       this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
    //     } else if (error.status === 500) {
    //       this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.statusText}` });
    //     } 
    //   },
    // })
    // )
  }



  // listarDepartamento():SubscriptionLike{
  //   let subl: SubscriptionLike = 
  //     this.ubigeoService.listDepartamento(this.tipoUbigeo)
  //    .subscribe({
  //     next: (res) => {
  //       this.listadoDepartamento = res.data; 
  //     },
  //     error: (error: any) => {
  //       if (error.status === 400) {
  //         this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
  //       } else if (error.status === 500) {
  //         this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.statusText}` });
  //       } 
  //     },
  //   }); 
  //   return subl; 
  // }

  // listarProvincia(idUbigeo:number):SubscriptionLike{
  //   let subl: SubscriptionLike = 
  //     this.ubigeoService.listProvincia(this.tipoUbigeo,idUbigeo)
  //    .subscribe({
  //     next: (res) => {
  //       this.listadoProvincia = res.data; 
  //     },
  //     error: (error: any) => {
  //       if (error.status === 400) {
  //         this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
  //       } else if (error.status === 500) {
  //         this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.statusText}` });
  //       } 
  //     },
  //   }); 
  //   return subl; 
  // }

  // listarDistrito(idUbigeo:number):SubscriptionLike{
  //   let subl: SubscriptionLike = 
  //     this.ubigeoService.listDistrito(this.tipoUbigeo,idUbigeo)
  //    .subscribe({
  //     next: (res) => {
  //       this.listadoDistrito = res.data; 
  //     },
  //     error: (error: any) => {
  //       if (error.status === 400) {
  //         this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
  //       } else if (error.status === 500) {
  //         this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.statusText}` });
  //       } 
  //     },
  //   }); 
  //   return subl; 
  // }

  listarFiltros():SubscriptionLike{
    let subl: SubscriptionLike = 
    forkJoin([
      this.especialidadService.list(),
      this.declaracionInteresService.list(),
      this.sancionService.list(),
      this.tipoDocumentoService.list()


    ])  .subscribe({
      next: (res) => {
        this.listadoEspecialidad = res[0].data; 
        this.listadoDeclaracionInteres = res[1].data; 
        this.listadoSancion = res[2].data; 
        this.listadoTipoDocumento = res[3].data; 

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


  // registrarActualizar():SubscriptionLike{
  //   // let subl: SubscriptionLike;
  //   // if(this.distritoSelect) this.arbitro.ubigeoId = this.distritoSelect.ubigeoId;
  //   //   if(this.arbitro.arbitroId==null){  
  //   //      subl =this.registrar(this.arbitro); 
  //   //   }else{ 
  //   //     subl =this.actualizar(  this.arbitro );
  //   //   }
  //   //   return subl;
  // }

  registrar(arbitro:Arbitro):SubscriptionLike{
    arbitro.auditUsuarioCreacion='USUARIO_GENERICO_REGISTRO'
    return this.arbitroService.insert(arbitro)
    .subscribe({
      next: (res) => {
            let value:any={}
            value.result='OK'
            value.mensaje = res.mensaje;
            this.ref.close(value); 
      },
      error: (error: any) => {
        if (error.status === 400) {
          this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
        } else if (error.status === 500) {
          this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.error.mensaje}` });
        } 
      },
    });
  }

  actualizar(arbitro:Arbitro):SubscriptionLike{
    arbitro.auditUsuarioModifica='USUARIO_GENERICO_MODIFICA'
    return this.arbitroService.update(arbitro)
    .subscribe({
      next: (res) => {
        let value:any={}
        value.result='OK'
        value.mensaje = res.mensaje;
        this.ref.close(value); 
      },
      error: (error: any) => {
        if (error.status === 400) {
          this.messageService.add({ key: 'warn', severity: 'warn', summary: `${error.error.mensaje}`, detail: error.error.detalles });
        } else if (error.status === 500) {
          this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `${error.statusText}` });
        } 
      },
    });
  }


  cancelar(){
    this.ref.close(); 
  }

}
