import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(public rout:Router){

  }
  CerrarSesion(){
    localStorage.removeItem('token');
    this.rout.navigateByUrl('login');
  }
}
