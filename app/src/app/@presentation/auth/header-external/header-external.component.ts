import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'centro-arbitraje-header-external',
  templateUrl: './header-external.component.html',
  styleUrls: ['./header-external.component.scss'],
})
export class HeaderExternalComponent implements OnInit {
  @Input() isLauncher: string = '';
  title: string = '';
  subTitle: string = '';
  dark: boolean;

  checked: boolean;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.isLauncher === '1' ? this.title = 'Sistema de Arbitraje Popular y del Registro Nacional de Árbitros' : this.title = 'ARBITRAJE POPULAR';
    this.isLauncher === '1' ? this.subTitle = 'y Centros de Arbitraje (RENACE)' : this.subTitle = 'Sistema de Arbitraje Popular';
  }

  login () {

    //llama al servicio de autenticacion

    // si retorna inicio de sesion correcto redirige a la pagina principal
    this.redirectHome();
  }

  redirectHome () {
    this.router.navigateByUrl('/pages/home');
  } 
}
