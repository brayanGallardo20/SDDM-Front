import { Menu } from './menu';
import { Rol } from './rol';
export class UsuarioLogin{
    idUsuario!:number;
    rolMenu:Rol[]=[];
    rol:Rol[]=[];
    nombre!:string;
    apePat!:string;
    apeMat!:string;
    usuario!:string;
}