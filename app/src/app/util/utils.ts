import { DatePipe } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { Const } from '../@data/services/const'; 
export class Utils {


  static localDateTime(input) {
    if(input!=='' && input!==null) {
        const year   = input[0] || 0;
        const month  = input[1] || 0;
        const day    = input[2] || 0;
        const hour   = input[3] || 0;
        const minute = input[4] || 0;
        const second = input[5] || 0;
        const nano   = input[6] || 0;

        const date = new Date(year, month-1, day, hour, minute, second, nano);
        return this.formatDate(date);
  }

  return '';

  }
  
  static padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  static arrayHourMin(horaMIn) {
    var arrayHourMin = [];
    arrayHourMin = horaMIn.split(":");

    return arrayHourMin;
  }
  
  static formatDate(date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  static obtenerNombreTabla(tabla) {
    var descripcion = "";
    if(tabla == Const.MAE_ETAPA_ARBITRAL) {
      descripcion = "Etapa Arbitral";
    }
    if(tabla == Const.MAE_SUBETAPA_ARBITRAL) {
      descripcion = "Sub Etapa Arbitral";
    }
    if(tabla == Const.MAE_TIPO_OPERADOR) {
      descripcion = "Tipo de Operador";
    }
    if(tabla == Const.MAE_TIPO_ARBITRO) {
      descripcion = "Tipo de Árbitro";
    }
    if(tabla == Const.MAE_ESTADO_ARBITRAL) {
      descripcion = "Estado Arbitral";
    }
    if(tabla == Const.MAE_TIPO_OPERADOR_ARBITRAL) {
      descripcion = "Tipo Operador";
    }

    return descripcion;
  }

  static obtenerIdOperadorArbitral(url) {

    var id = null;
    if(url === 'public') {
     id = Const.INST_PUBLICA;
    }

    if(url === 'private') {
      id = Const.INST_PRIVADA;
    }

    if(url === 'arbitra') {
      id = Const.INST_ARBITRA;
    }

    return id;

    }

    static obtenerLabelOperadorArbitral(url) {

      var label = null;
      if(url === 'public') {
        label = 'Instituciones Públicas';
      }
  
      if(url === 'private') {
        label = 'Instituciones Privadas';
      }
  
      if(url === 'arbitra') {
        label = 'Sedes Arbitra Perú';
      }
  
      return label;
  
      }

  static obtenerNombreLabel(tabla) {
    var descripcion = "";
    if(tabla == Const.MAE_ETAPA_ARBITRAL) {
      descripcion = "Nombre de etapa";
    }
    if(tabla == Const.MAE_TIPO_OPERADOR) {
      descripcion = "Nombre de Operador";
    }
    if(tabla == Const.MAE_TIPO_ARBITRO) {
      descripcion = "Tipo de Árbitro";
    }
    if(tabla == Const.MAE_ESTADO_ARBITRAL) {
      descripcion = "Estado Arbitral";
    }
    if(tabla == Const.MAE_TIPO_OPERADOR_ARBITRAL) {
      descripcion = "Nombre de Operador";
    }

    return descripcion;
  }

  static obtenerNombreLabelTabla(tabla) {
    var descripcion = "";
    if(tabla == Const.MAE_ETAPA_ARBITRAL) {
      descripcion = "Nombre";
    }
    if(tabla == Const.MAE_TIPO_OPERADOR) {
      descripcion = "NOMBRE DE OPERADOR";
    }
    if(tabla == Const.MAE_TIPO_ARBITRO) {
      descripcion = "TIPO DE ÁRBITRO";
    }
    if(tabla == Const.MAE_ESTADO_ARBITRAL) {
      descripcion = "ESTADO ARBITRAL";
    }
    if(tabla == Const.MAE_TIPO_OPERADOR_ARBITRAL) {
      descripcion = "TIPO OPERADOR";
    }

    return descripcion;
  }

  static obtenerNombreLabelSearch(tabla) {
    var descripcion = "";
    if(tabla == Const.MAE_ETAPA_ARBITRAL) {
      descripcion = "Nombre";
    }
    if(tabla == Const.MAE_TIPO_OPERADOR) {
      descripcion = "Nombre de Operador";
    }
    if(tabla == Const.MAE_TIPO_ARBITRO) {
      descripcion = "Tipo de Árbitro";
    }
    if(tabla == Const.MAE_ESTADO_ARBITRAL) {
      descripcion = "Estado Arbitral";
    }
    if(tabla == Const.MAE_TIPO_OPERADOR_ARBITRAL) {
      descripcion = "Nombre de Operador";
    }

    return descripcion;
  }

  static obtenerNombreUser() {
   return JSON.parse(sessionStorage.getItem('usuario')).usuario;
  }

  
 static menuTemporal =   {
  label: 'Opciones Desarrolladas', icon: 'pi pi-fw pi-star-fill', routerLink: ['/pages'],
  items: [
      {label: 'Maestro - Etapa Arbitral', icon: 'pi pi-fw pi-id-card', routerLink: ['/pages/master/MAE_ETAPA_ARBITRAL']},
      {label: 'Maestro - Sub Etapa Arbitral', icon: 'pi pi-fw pi-id-card', routerLink: ['/pages/master/MAE_SUBETAPA_ARBITRAL']},
      {label: 'Maestro - Tipo Operador', icon: 'pi pi-fw pi-id-card', routerLink: ['/pages/master/MAE_TIPO_OPERADOR']},
      {label: 'Maestro - Tipo Árbitro', icon: 'pi pi-fw pi-id-card', routerLink: ['/pages/master/MAE_TIPO_ARBITRO']},
      {label: 'Maestro - Tipo Documento', icon: 'pi pi-fw pi-id-card', routerLink: ['/pages/maestro-tpo-doc']},
      {label: 'Gestión Históricos', icon: 'pi pi-fw pi-id-card', routerLink: ['/pages/gestion-historicos']},
      {label: 'Parámetros', icon: 'pi pi-fw pi-id-card', routerLink: ['/pages/parametry']},
  ]
};

  static   optionsPaginated:number[]=[10,20,30];

  static   listadoTipoAuditoria: any[] = [
    { id: 1, value: 'I', descripcion: 'REGISTRAR' },
    { id: 2, value: 'U', descripcion: 'MODIFICAR' },
    { id: 3, value: 'D', descripcion: 'ELIMINAR' },
  ]
}

export class ItemTable {
  codigo: string;
  descripcion: string;
  lote: string;
  um: string;
  ubicacion: string;
  cantidad: number;
}

export interface IBaseCallback {
  onSuccess(): void;
}

export const opciones: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};


