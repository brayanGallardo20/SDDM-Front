import { MessageService } from 'primeng/api';
import { LoginService } from './../services/login.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationRepository } from '../../@domain/repository/authentication.repository';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private messageService:MessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    if(this.loginService.verificarLogin()){
      this.loginService.getUsuarioSubject().subscribe(res=>{});
      return true;
    }else{
      this.loginService.cerrarSesion();
      return false;
    }
  }
}
