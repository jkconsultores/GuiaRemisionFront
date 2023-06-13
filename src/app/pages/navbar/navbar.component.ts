import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public empresa:string|undefined;


  constructor(public rout:Router){
    this.empresa = localStorage.getItem("emp");
    console.log(this.empresa);
  }
  CerrarSesion(){
    localStorage.removeItem('token');
    this.rout.navigateByUrl('login');
  }
}
