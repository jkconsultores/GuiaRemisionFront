import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiRestService } from 'src/app/service/api-rest.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TMenuGre } from 'src/app/interface/TMenuGre';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public empresa:string|undefined;
  public usuario:string;
  public menu:TMenuGre[]=[];

  modalRef: NgbModalRef;

  constructor(public rout:Router, public api:ApiRestService,private modalService: NgbModal){
    this.empresa = localStorage.getItem("usuario");
  }
  ngOnInit(): void {
    this.api.VerificarAccesoAUsuario().subscribe((resp:any)=>{
      this.usuario=resp;
    });
    this.getMenu();
  }
  CerrarSesion(){
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.rout.navigateByUrl('login');
  }
  abrirModal(ModalTemplate) {
    this.modalRef = this.modalService.open(ModalTemplate, { size: 'lg' });
  }
  salir() {
    this.modalRef.close();
  }
  getMenu(){
    this.api.getMenu().subscribe((res:any)=>{
     this.menu=res
    })
  }
}
