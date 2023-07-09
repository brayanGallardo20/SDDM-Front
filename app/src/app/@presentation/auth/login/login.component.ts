import { MessageService } from 'primeng/api';
import { SubSink } from 'subsink';
import { LoginService } from './../../../@data/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/@data/model/usuario';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'centro-arbitraje-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  private readonly subSink = new SubSink();

  loginForm: FormGroup;

  checked: boolean;

  submitted = false;

  error = '';

  errorResponse = true;

  typePassword = 'password'

  ckMostrarClave: boolean = true;

  remember: boolean = false;

  chbxRecordar?: boolean = false;

  constructor(private router: Router,
    private formBuilderLogin: FormBuilder,
    private readonly loginService: LoginService,
    private cookieService: CookieService,
    private readonly messageService: MessageService  ) {
    this.loginForm = this.formBuilderLogin.group({
      nombreUsuario: ['', [Validators.required,]],
      clave: ['',[Validators.required,]],
      chbxRecordar: ['', null],
    });

  }

  get f() {
    return this.loginForm.controls;
  }


  ngOnInit(): void {
    sessionStorage.clear();
    this.errorResponse = false;
    this.llenarInformacion();
  }

  generateClassPasswordView() {
    return { 'pi pi-eye': !this.ckMostrarClave, 'pi pi-eye-slash': this.ckMostrarClave }
  }


  ingresar() {

    this.errorResponse = false;

    this.submitted = true;
    this.error = '';

    let recordar = this.loginForm.value.chbxRecordar;


    if (this.loginForm.valid) {
      this.error = 'Usuario y/o clave son incorrectos';

      let usuario: Usuario = new Usuario();
      usuario.usuario = this.loginForm.value.nombreUsuario;
      usuario.clave = this.loginForm.value.clave;
      this.subSink.add(this.loginService.entrarSistema(usuario).subscribe(
        {
          next: (response) => {
            this.loginService.guardarDatosSesion(response.data);
            if(recordar) {
              this.recordarContrasenia(usuario);
            } else {
              this.limpiarRecordarContrasenia();
            }
            this.redirectHome();
          },
          error: (error: any) => {
            if (error.status === 0) {
              this.errorResponse = false;
              this.messageService.add({ key: 'toast', severity: 'error', summary: 'Error', detail: `Se perdió conexión con el servidor` });
            } else {
              this.errorResponse = true;
            }
          },
        }
      ))


    } else {
      return;
    }
  }

  llenarInformacion() {

   let username = this.cookieService.get('username');

   if(username!=undefined && username!='') {
    
    this.loginForm.setValue({
      nombreUsuario: username,
      clave: '',
      chbxRecordar: true
    });

   }

  }

  limpiarRecordarContrasenia() {

    this.cookieService.delete('username');

  }

  recordarContrasenia(usuario) {

    this.loginService.recordarContrasenia(usuario.usuario,usuario.clave);

  }

  redirectHome() {
    this.router.navigateByUrl('/pages/home');
  }

  mostrarClave() {
    this.ckMostrarClave = !this.ckMostrarClave;
    if (!this.ckMostrarClave) {
      this.typePassword = 'text'
    } else {
      this.typePassword = 'password'
    }
  }
}
