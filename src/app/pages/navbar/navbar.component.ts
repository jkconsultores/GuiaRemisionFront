import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiRestService } from 'src/app/service/api-rest.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TMenuGre } from 'src/app/interface/TMenuGre';
import { USUARIO } from 'src/app/interface/Usuario';
import Swal from 'sweetalert2';
import { RespuestaDeLLaveValor } from 'src/app/interface/RespuestasGenericas';
import { AuthServiceService } from 'src/app/service/auth-service.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public empresa:string|undefined;
  public usuario:string;
  public menu:TMenuGre[]=[];
  passchange:RespuestaDeLLaveValor|undefined;
  public datos:any;

  modalRef: NgbModalRef;

  constructor(public rout:Router, public api:ApiRestService,private modalService: NgbModal,private auth:AuthServiceService){
    this.empresa = localStorage.getItem("usuario");
  }
  ngOnInit(): void {
    this.api.VerificarAccesoAUsuario().subscribe((resp:any)=>{
      this.usuario=resp;
    });
    this.getMenu();
    this.api.ObtenerUsuarioLogeado().subscribe((resp:any)=>{
      this.datos=resp
    });
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
  cambiarPass(){

    Swal.fire({
      title: 'Introduce la nueva contraseña para: '+this.datos.usuario,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonText:"Cancelar",
      confirmButtonText: 'Actualizar',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        this.passchange={id:this.datos.id.toString(),text:login}
        return this.api.actualziarContraseña(this.passchange).subscribe((resp:any)=>{

        },(error:any)=>{Swal.showValidationMessage(
          `Error: ${error}`
        )});
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.CloseSession();
        Swal.fire({
          title: 'Usuario modificado',
          text:'La contraseña de: '+this.datos.usuario+" fue actualizada correctamente"
        })
      }
    })
  }
}
