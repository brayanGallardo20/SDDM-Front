import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, concatMap, map, timeout } from 'rxjs/operators';
import { Const } from './const';
import { AuthenticationRepository } from 'src/app/@domain/repository/authentication.repository';

import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { UserRoles } from '../model/userRoles';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends AuthenticationRepository {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private applicationRoles = [];
  private userRoles = [];
  private valToken: string = null;
  public entidadesIds: string;
  public rolId: number;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    super();
    // Falta el endpoint de obtener data de usuario por mientras sera del api persona
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(sessionStorage.getItem('persona'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get getCurrentUserValue(): User {
    return this.currentUserSubject.value;
  }
 
  logout(): void {
    sessionStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/auth');
  }

  clearUser(): void {
    this.currentUserSubject.next(null);
  }

}
