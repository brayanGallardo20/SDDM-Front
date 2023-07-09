import { GestionConfiguracionModule } from './gestion-configuracion/gestion-configuracion.module';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { DefaultPageComponent } from './default-page/default-page.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'home',
        component: DefaultPageComponent,
        data: {
          title: 'Home',
        },
      },
      {
        path: 'historical',
        data: {
          title: 'Historicos',
        },
        loadChildren: () =>
        import('./historical/historical.module').then(
          (m) => m.HistoricalModule
        ),
      },
      {
        path: 'referee',
        data: {
          title: 'Árbitros',
        },
        loadChildren: () =>
        import('./referee/referee.module').then(
          (m) => m.RefereeModule
        ),
      }, 
      {
        path: 'parametry',
        data: {
          title: 'Parametria',
        },
        loadChildren: () =>
        import('./parametry/parametry.module').then(
          (m) => m.ParametryModule
        ),
      },
      
      
      {
        path: 'gestion-historicos',
        data: {
          title: 'Historicos',
        },
        loadChildren: () =>
        import('./gestion-historicos/gestion-historicos.module').then(
          (m) => m.GestionHistoricosModule
        ),
      },
      {
        path: 'gestion-configuracion',
        data: {
          title: 'Configuración',
        },
        loadChildren: () =>
        import('./gestion-configuracion/gestion-configuracion.module').then(
          (m) => m.GestionConfiguracionModule
        ),
      },
      {
        path: 'maestros-arbitro',
        data: {
          title: 'Árbitro',
        },
        loadChildren: () =>
        import('./maestros-arbitro/maestros-arbitro.module').then(
          (m) => m.MaestrosArbitroModule
        ),
      },
      {
        path: 'institution/public',
        data: {
          title: 'Institución Pública',
        },
        loadChildren: () =>
        import('./institution/institution.module').then(
          (m) => m.InstitutionModule
        ),
      },
      {
        path: 'institution/private',
        data: {
          title: 'Institución Privada',
        },
        loadChildren: () =>
        import('./institution/institution.module').then(
          (m) => m.InstitutionModule
        ),
      },
      {
        path: 'institution/arbitra',
        data: {
          title: 'Arbitra Peru',
        },
        loadChildren: () =>
        import('./institution/institution.module').then(
          (m) => m.InstitutionModule
        ),
      },
      {
        path: 'master/:nombretabla',
        data: {
          title: 'Maestra',
        },
        loadChildren: () =>
        import('./master/master.module').then(
          (m) => m.MasterModule
        ),
      },
      {
        path: 'aranceles',
        data: {
          title: 'Aranceles',
        },
        loadChildren: () =>
        import('./duty/duty.module').then(
          (m) => m.DutyModule
        ),
      },
      {
        path: 'fee',
        data: {
          title: 'Tarifa',
        },
        loadChildren: () =>
        import('./fee/fee.module').then(
          (m) => m.FeeModule
        ),
      },
      {
        path: 'specialization',
        data: {
          title: 'Especialización',
        },
        loadChildren: () =>
        import('./master-specialization/master-specialization.module').then(
          (m) => m.MasterSpecializationModule
        ),
      },
      {
        path: 'arbitrationMatter',
        data: {
          title: 'Materia Arbitral',
        },
        loadChildren: () =>
        import('./master-arbitrationMatter/master-arbitrationMatter.module').then(
          (m) => m.MasterArbitrationMatterModule
        ),
      },  
      {    
        path: 'specialty',
        data: {
          title: 'Especialidad',
        },
        loadChildren: () =>
        import('./master-specialty/master-specialty.module').then(
          (m) => m.MasterSpecialtyModule
        ),
      },
      {
        path: 'maestro-tpo-doc',
        data: {
          title: 'Tipo Documento',
        },
        loadChildren: () => import('./maestro-tpo-doc/maestro-tpo-doc.module').then(m => m.MaestroTpoDocModule),
      },
      {
        path: 'maestro-cod-sgd',
        data: {
          title: 'Código SGD',
        },
        loadChildren: () => import('./maestro-cod-sgd/maestro-cod-sgd.module').then(m => m.MaestroCodSgdModule),
      },
      {
        path: 'maestro-sub-etapa',
        data: {
          title: 'Sub Etapa Arbitral',
        },
        loadChildren: () => import('./maestro-sub-etapa/maestro-sub-etapa.module').then(m => m.MaestroSubEtapaModule),
      },
      {
        path: 'maestro-etapa',
        data: {
          title: 'Etapa Arbitral',
        },
        loadChildren: () => import('./maestro-etapa/maestro-etapa.module').then(m => m.MaestroEtapaModule),
      },
      {
        path: 'mant-inst-pub-crud/public/new/0',
        loadChildren: () => import('./crud-inst-pub/crud-inst-pub.module').then(m => m.CrudInstPubModule),
      },
      {
        path: 'mant-inst-pub-crud/private/new/0',
        loadChildren: () => import('./crud-inst-pub/crud-inst-pub.module').then(m => m.CrudInstPubModule),
      },
      {
        path: 'mant-inst-pub-crud/arbitra/new/0',
        loadChildren: () => import('./crud-inst-pub/crud-inst-pub.module').then(m => m.CrudInstPubModule),
      },
      {
        path: 'mant-inst-pub-crud/public/edit/:id',
        loadChildren: () => import('./crud-inst-pub/crud-inst-pub.module').then(m => m.CrudInstPubModule),
      },
      {
        path: 'mant-inst-pub-crud/private/edit/:id',
        loadChildren: () => import('./crud-inst-pub/crud-inst-pub.module').then(m => m.CrudInstPubModule),
      },
      {
        path: 'mant-inst-pub-crud/arbitra/edit/:id',
        loadChildren: () => import('./crud-inst-pub/crud-inst-pub.module').then(m => m.CrudInstPubModule),
      },
      {
        path: 'mant-inst-pub-crud/public/view/:id',
        loadChildren: () => import('./crud-inst-pub/crud-inst-pub.module').then(m => m.CrudInstPubModule),
      },
      {
        path: 'mant-inst-pub-crud/private/view/:id',
        loadChildren: () => import('./crud-inst-pub/crud-inst-pub.module').then(m => m.CrudInstPubModule),
      },
      {
        path: 'mant-inst-pub-crud/arbitra/view/:id',
        loadChildren: () => import('./crud-inst-pub/crud-inst-pub.module').then(m => m.CrudInstPubModule),
      },
      {
        path: 'sedes',
        data: {
          title: 'Sedes',
        },
        loadChildren: () => import('./sedes/sedes.module').then(m => m.SedesModule),
      },
      {
        path: 'directivo',
        data: {
          title: 'Directivo',
        },
        loadChildren: () => import('./directivo/directivo.module').then(m => m.DirectivoModule),
      },
      {
        path: '**',
        component: DefaultPageComponent,
        data: {
          title: 'Home',
        },
      },
    ],
  },
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
  menu = [];

  constructor() {}
}
