import { Router } from '@angular/router';
import { UsuarioLogin } from './../model/usuario-login';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Respuesta } from '../model/respuesta';
import { Usuario } from '../model/usuario';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly host = `${environment.API_CENTRO_ARBITRAJE}/api/login`;

  private usuarioSubject: Subject<UsuarioLogin> = new Subject<UsuarioLogin>();
  private menuSubject: Subject<any[]> = new Subject<any[]>();
  private usuario: UsuarioLogin;


  constructor(protected readonly http: HttpClient,
    private readonly router: Router,
    private cookieService: CookieService

  ) { }

  entrarSistema(usuario: Usuario): Observable<Respuesta<UsuarioLogin>> {
    return this.http.post<Respuesta<UsuarioLogin>>(`${this.host}/entrarSistema`, usuario);
  }

  public get getUsuarioIni(): UsuarioLogin{
    if (this.usuario != null) {
      return this.usuario;
    } else if (this.usuario == null && sessionStorage.getItem('usuario') != null) {
      this.usuario = JSON.parse(sessionStorage.getItem('usuario'))
      return this.usuario;
    }
    return null;
  } 

  verificarLogin(): boolean {
    if (sessionStorage.getItem('usuario') != null) {
      this.setUsuarioSuject(JSON.parse(sessionStorage.getItem('usuario')))
      return true;
    } else {
      //Verificamos si existe token 
      return false;
    }
  }



  guardarDatosSesion(usuarioLogin: UsuarioLogin) {
    // usuarioLogin.rolMenu = this.retornarMenu(usuarioLogin.rolMenu)
    sessionStorage.setItem('usuario', JSON.stringify(usuarioLogin));
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'))
    this.setUsuarioSuject(usuarioLogin);
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigateByUrl('')
  }

  recordarContrasenia(username, password) {

    this.cookieService.set('username', username);  
    
  }

  getUsuarioSubject(): Observable<UsuarioLogin> {
    if (sessionStorage.getItem('usuario') != null) {
      this.setUsuarioSuject(JSON.parse(sessionStorage.getItem('usuario')))
    }

    return this.usuarioSubject.asObservable();
  }

  setUsuarioSuject(usuarioLogin: UsuarioLogin) {
    this.usuarioSubject.next(usuarioLogin)
  }

  

  getMenu():Observable<any[]>{
    return this.menuSubject.asObservable();
  } 

  setMenu(menu: any) {
    this.menuSubject.next(menu)
  } 

}
