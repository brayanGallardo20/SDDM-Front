import { AfterViewInit, Component } from '@angular/core';
@Component({
  selector: 'gme-web-pages',
  styleUrls: ['auth.component.scss'],
  template: `

  <div style="overflow-x: hidden;  height: 100%;">
  <centro-arbitraje-header-external launcher="0"></centro-arbitraje-header-external>  
  <router-outlet ></router-outlet> 
<centro-arbitraje-footer-external></centro-arbitraje-footer-external>
  <div>
 
  

  `,
})
export class AuthComponent implements AfterViewInit {
  ngAfterViewInit(): void {
/* 
    document.getElementById(
      'panel'
    ).style.background = `url("./assets/images/bg.png")`; */


  }
}
