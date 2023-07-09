import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/@data/services/login.service';

@Component({
  selector: 'app-launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.scss']
})
export class LauncherComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goHome() {
    if(this.loginService.verificarLogin()){
      this.router.navigateByUrl('pages/home')
    }else{
      this.router.navigateByUrl('auth/login')
    }
  }
}
