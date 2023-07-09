import { Utils } from 'src/app/util/utils';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PagesComponent } from '../../pages.component';
import { SelectItem } from 'primeng/api';
import { LoginService } from 'src/app/@data/services/login.service';

interface Rol {
  idRol: number,
  nombre: string
}

@Component({
  selector: 'centro-arbitraje-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {

  activeItem: number;
  roles: Rol[];
  rolSeleccionado!: Rol;
  nombreUsuario: string = '';
  constructor(public appMain: PagesComponent,
    private readonly loginService: LoginService
  ) {


  }

  mobileMegaMenuItemClick(index) {
    this.appMain.megaMenuMobileClick = true;
    this.activeItem = this.activeItem === index ? null : index;
  }

  ngOnInit() {
    if (this.loginService.getUsuarioIni.rol.length > 0) {
      this.roles = this.loginService.getUsuarioIni.rol;
      this.nombreUsuario = this.loginService.getUsuarioIni.nombre + ' ' +this.loginService.getUsuarioIni.apePat + ' ' + this.loginService.getUsuarioIni.apeMat;
      this.rolSeleccionado = this.loginService.getUsuarioIni.rol.find((rol) => this.loginService.getUsuarioIni.rolMenu[0].idRol === rol.idRol)
    }


  }

  seleccionarRol() {
    let menuDinamico:any[] = this.loginService.getUsuarioIni.rolMenu.filter((rolMenu) => rolMenu.idRol === this.rolSeleccionado.idRol )[0].menu;
    this.loginService.setMenu(menuDinamico);
  }

 
  closeSession() {
  
    this.loginService.cerrarSesion();
  }

  home() {

  }

}
