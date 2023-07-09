import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuRepository } from 'src/app/@domain/repository/menu.repository';

@Injectable()
export class MenuService  extends MenuRepository {

    public menuSource = new Subject<string>();
    public resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(key: string) {
        this.menuSource.next(key);
    }

    reset() {
        this.resetSource.next(true);
    }
}
