import { forkJoin, NEVER, switchMap } from 'rxjs';
import { SubSink } from 'subsink';
import { LoginService } from './../../../../@data/services/login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PagesComponent } from '../../pages.component';
import { asRoughMinutes } from '@fullcalendar/core';

@Component({
    selector: 'centro-arbitraje-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

    model: any[] = []
    menussss: any[] = []
    private subSink = new SubSink();

    constructor(public appMain: PagesComponent,
        public loginService: LoginService
    ) { }

    ngOnInit() {

        if (this.loginService.getUsuarioIni.rol.length > 0) {
            this.model = this.loginService.getUsuarioIni.rolMenu[0].menu;
        }
        this.loginService.getMenu().subscribe(menus => {
            this.model = menus;
        })
    }


    ngOnDestroy(): void {
        this.subSink.unsubscribe();
    }

    closeSession() {

        this.loginService.cerrarSesion();
    }

    onMenuClick() {
        this.appMain.menuClick = true;
    }
}

