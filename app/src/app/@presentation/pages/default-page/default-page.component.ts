import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/@data/model/user';
import { LoginService } from '../../../@data/services/login.service';

@Component({
  selector: 'centro-arbitraje-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss']
})

export class DefaultPageComponent implements OnInit {

  ciclo = JSON.parse(sessionStorage.getItem('ciclo'));
  user: User;
  nombreRol = '';
  nombreUsuario: string = '';

  constructor(
    private readonly loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.nombreUsuario = this.loginService.getUsuarioIni.nombre + ' ' +this.loginService.getUsuarioIni.apePat + ' ' + this.loginService.getUsuarioIni.apeMat;
  }


}
