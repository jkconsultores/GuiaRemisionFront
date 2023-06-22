import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  Usuario:string = "token";
  nombreUsuario:string="usuario";
  login = new Subject<Boolean>();
  login1$ = this.login.asObservable();
  httpOptions:any |undefined;
  constructor(private router:Router) { }

  isLogin() {
    var datos = localStorage.getItem(this.Usuario);
    if(datos!="" && datos!= undefined){
      return true;
    }
    return false;
  }
  SessionSaved( token:string){
    localStorage.setItem(this.Usuario, token);
  }
  UserSaved( usuario:string){
    localStorage.setItem(this.nombreUsuario, usuario);
  }
  CloseSession(){
    localStorage.clear();
    this.router.navigate(['../login']);
  }
  Logout(){
    localStorage.clear();
  }

  sendData(){
    this.login.next(this.isLogin());
  }
  public obtenerDatos():any{
    var datos = localStorage.getItem(this.Usuario);
    if(datos!="" && datos!= undefined){
      return this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'bearer '+localStorage.getItem(this.Usuario)
        })
      };;
    }
    return "";
  }

}

