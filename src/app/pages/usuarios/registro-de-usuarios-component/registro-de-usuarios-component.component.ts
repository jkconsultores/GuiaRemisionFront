import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MOTIVOS } from 'src/app/interface/Motivos';
import { USUARIO, UsuariosDTO } from 'src/app/interface/Usuario';
import { AAA_TIPODOCUMENTO } from 'src/app/interface/aaa_TipoDocumento';
import { ApiRestService } from 'src/app/service/api-rest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-de-usuarios-component',
  templateUrl: './registro-de-usuarios-component.component.html',
  styleUrls: ['./registro-de-usuarios-component.component.scss']
})
export class RegistroDeUsuariosComponentComponent implements OnInit {
  modalRef: NgbModalRef;
  arraySerie:AAA_TIPODOCUMENTO[] = [];
  arrayMotivo:MOTIVOS[]=[];
  serieNumero = '';
  motivo = '';
  usuarios:USUARIO[]=[];
  correoUsuario='';
  nombreUserUsuario='';
  contraseñaUsuario='';
  nombreUsuario='';
  constructor(private modalService: NgbModal,private api:ApiRestService){}
  ngOnInit(): void {
    this.obtenerUsuarios();
    // this.api.getSeries().subscribe((resp:any)=>{
    //   this.arraySerie=resp
    // },error=>{

    // });
    // this.api.getMotivos().subscribe((resp:any)=>{
    //   this.arrayMotivo=resp;
    // })
  }
  obtenerUsuarios(){
    this.api.getUsuarios().subscribe((resp:any)=>{
      this.usuarios=resp;
    })
  }
  abrirModal(ModalTemplate) {
    this.modalRef = this.modalService.open(ModalTemplate, { size: 'lg' });
  }
  salir() {
    this.modalRef.close();
  }
  AgregarUsuario(ref: NgForm){
    let user:UsuariosDTO={
      contrasena:ref.value.contraseñaUsuario,
      correoelectronico:ref.value.correoUsuario,
      nombres:ref.value.nombreUsuario,
      nombreusuario:ref.value.nombreUserUsuario
    }
    this.api.agregarUsuario(user).subscribe((resp:any)=>{
      this.usuarios.push(resp);
      Swal.fire("Usuario creado satisfactoriamente","","success");
    },error=>{
      Swal.fire("No se pudo crear el usuario","","error")
    });
  }
  eliminarUsuario(idUsuario:number){
    this.api.deleteUsuario(idUsuario).subscribe(resp=>{
      Swal.fire("Usuario eliminado satisfactoriamente","","success");
      this.obtenerUsuarios();
    },error=>{
      Swal.fire("No se pudo eliminar el usuario","","error")
    });
  }
}
