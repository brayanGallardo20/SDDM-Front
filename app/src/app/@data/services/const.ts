import { ContentChild, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Const {
  public static API_CENTRO_ARBITRAJE: string;
  public static MAE_ETAPA_ARBITRAL: string;
  public static MAE_SUBETAPA_ARBITRAL: string;
  public static MAE_TIPO_OPERADOR: string;
  public static MAE_TIPO_ARBITRO: string;
  public static MAE_ESTADO_ARBITRAL: string;
  public static MAE_TIPO_OPERADOR_ARBITRAL: string;

  public static INST_PUBLICA: number;
  public static INST_PRIVADA: number;
  public static INST_ARBITRA: number;
  public static APPLICATION_ID: number;

  constructor() {}

  public loadCommonConfig() {
    Const.API_CENTRO_ARBITRAJE = environment.API_CENTRO_ARBITRAJE;
    Const.MAE_ETAPA_ARBITRAL = "MAE_ETAPA_ARBITRAL";
    Const.MAE_SUBETAPA_ARBITRAL = "MAE_SUBETAPA_ARBITRAL";
    Const.MAE_TIPO_OPERADOR = "MAE_TIPO_OPERADOR";
    Const.MAE_TIPO_ARBITRO = "MAE_TIPO_ARBITRO";
    Const.MAE_ESTADO_ARBITRAL = "MAE_ESTADO_ARBITRAL";
    Const.MAE_TIPO_OPERADOR_ARBITRAL = "MAE_TIPO_OPERADOR_ARBITRAL";
    Const.INST_PRIVADA = 2;
    Const.INST_ARBITRA = 3;
    Const.INST_PUBLICA = 1;


  }

  public loadAplicationConfig() {
    Const.APPLICATION_ID = environment.aplication_id;
  }
}
