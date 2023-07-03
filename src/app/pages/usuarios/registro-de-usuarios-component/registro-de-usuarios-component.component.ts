import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MOTIVOS } from 'src/app/interface/Motivos';
import { PermisoDTO, T_Permiso } from 'src/app/interface/Permiso';
import { RespuestaDeLLaveValor } from 'src/app/interface/RespuestasGenericas';
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
  filterUsuario='';
  TipoServicio='Serie';
  nombreUsuario='';
  passchange:RespuestaDeLLaveValor|undefined;
  RolesDEUSuario:T_Permiso[]=[]
  RolesDEUSuarioNuevos:PermisoDTO[]=[]
  usuarioEditado:number|undefined;

  public permisos:PermisoDTO[] =[];

  constructor(private modalService: NgbModal,private api:ApiRestService){}
  ngOnInit(): void {
    this.obtenerUsuarios();
    this.api.getSeries().subscribe((resp:any)=>{
      this.arraySerie=resp
    },error=>{

    });
    this.api.getMotivos().subscribe((resp:any)=>{
      this.arrayMotivo=resp;
    })
  }
  obtenerUsuarios(){
    this.api.getUsuarios().subscribe((resp:any)=>{
      this.usuarios=resp;
    })
  }
  abrirModal(ModalTemplate) {
    this.modalRef = this.modalService.open(ModalTemplate, { size: 'lg' });
  }
  editaRoles(ModalTemplate,usuarioId:number){
    this.RolesDEUSuarioNuevos=[];
    this.usuarioEditado = usuarioId;
    this.modalRef = this.modalService.open(ModalTemplate, { size: 'lg' });
    this.api.ObtenerRolesDeUsuario(usuarioId).subscribe((resp:any)=>{
      this.RolesDEUSuario=resp
      this.RolesDEUSuario.forEach(x=> this.RolesDEUSuarioNuevos.push({
        estado:x.estado,
        idUsuario :x.idUsuario,
        tipo:x.tipo,
        valor:x.valor
      }))
    })
  }
  salir() {
    this.modalRef.close();
  }
  AgregarPermisosEdicion(){
    let valor ="";
    if(this.TipoServicio=="Serie"){
      valor=this.serieNumero
    }
    else{
      valor=this.motivo
    }
    if(!this.RolesDEUSuario.some(x=>x.tipo==this.TipoServicio && x.valor==valor)){
      this.RolesDEUSuarioNuevos.push({
        estado:true,
        idUsuario:0,
        tipo:this.TipoServicio,
        valor:valor
      })
    }
  }
  AgregarUsuario(ref: NgForm){
    if (ref.invalid) {
      return
    }
    let user:UsuariosDTO={
      contrasena:ref.value.contraseñaUsuario,
      correoelectronico:ref.value.correoUsuario,
      nombres:ref.value.nombreUsuario,
      nombreusuario:ref.value.nombreUserUsuario
    }
    this.api.agregarUsuario(user).subscribe((resp:any)=>{
      this.usuarios.push(resp);
      this.permisos.forEach((permiso) => {
        permiso.idUsuario = resp.usuarioid;
      });
      this.api.AgregarPermisos(this.permisos).subscribe((resp:any)=>{
        this.modalRef.close();
      })
      Swal.fire("Usuario creado satisfactoriamente","","success");
    },error=>{
      Swal.fire("No se pudo crear el usuario","","error")
    });
  }
  async eliminarUsuario(idUsuario: number) {
    const result = await Swal.fire({
      title: '¿Estás seguro de borrar?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons:true,
      cancelButtonColor:'red',
      confirmButtonColor:'green'
    });
    if (!result.isConfirmed) {
      return;
    }
    this.api.deleteUsuario(idUsuario).subscribe(
      resp => {
        Swal.fire('Usuario eliminado satisfactoriamente', '', 'success');
        this.obtenerUsuarios();
      },
      error => {
        Swal.fire('No se pudo eliminar el usuario', '', 'error');
      }
    );
  }
  retirarPermisoUpdate(tipo:string,valor:string){
    this.RolesDEUSuarioNuevos = this.RolesDEUSuarioNuevos.filter((permiso) => {
      return !(permiso.tipo === tipo && permiso.valor === valor);
    });
  }
  AgregarPermisos(){
    let valor ="";
    if(this.TipoServicio=="Serie"){
      valor=this.serieNumero
    }
    else{
      valor=this.motivo
    }
    if(!this.permisos.some(x=>x.tipo==this.TipoServicio && x.valor==valor)){
      this.permisos.push({
        estado:true,
        idUsuario:0,
        tipo:this.TipoServicio,
        valor:valor
      })
    }
  }
  retirarPermiso(tipo:string,valor:string){
    this.permisos = this.permisos.filter((permiso) => {
      return !(permiso.tipo === tipo && permiso.valor === valor);
    });
  }
  cambiarPass(usuario:USUARIO){
    Swal.fire({
      title: 'Introduce la nueva contraseña para el usuario: '+usuario.nombreusuario,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonText:"Cancelar",
      confirmButtonText: 'Actualizar',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        this.passchange={id:usuario.usuarioid.toString(),text:login}
        return this.api.actualziarContraseña(this.passchange).subscribe((resp:any)=>{

        },(error:any)=>{Swal.showValidationMessage(
          `Error: ${error}`
        )});
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Usuario modificado',
          text:'La ontraseña del usuario: '+usuario.nombreusuario+" fue actualizada correctamente"
        })
      }
    })
  }
  DarDeBaja(usuario:USUARIO){

    let estado =1;
    let estadoDatos ="retirar";
    let estadoDatos1 ="retirado";
    if(usuario.estado){estado=0;estadoDatos="retirar";estadoDatos1='retirado'}else{estado=1;estadoDatos="brindar";estadoDatos1='brindado'}
    this.passchange={id:usuario.usuarioid.toString(),text:estado.toString()}

    Swal.fire({
      title: 'Atencion!',
      text: "Estas seguro que deseas "+estadoDatos+" el acceso al usuario "+ usuario.nombreusuario ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: estadoDatos+' acceso!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.CambiarAccesoUsuario(this.passchange).subscribe((resp:any)=>{
          this.obtenerUsuarios();
          Swal.fire({
            title:"Felicidades",
            text:"Los accesos fueron "+estadoDatos1
          });
        })
      }
    })
  }
  ActualziarUsuario(){
    this.RolesDEUSuarioNuevos.forEach((permiso) => {
      permiso.idUsuario = this.usuarioEditado;
    });
    this.api.ActualizarPermisos(this.RolesDEUSuarioNuevos).subscribe((resp:any)=>{
      this.modalRef.close();
      Swal.fire({
        title:"Felicidades",
        text:"Los accesos fueron actualizados"
      });
    });
  }
  reemplazarMotivo(tipo: string, valor: string): string {
    if (tipo === "Motivo") {
      const index = this.arrayMotivo.findIndex((dato) => dato.id.toString() === valor);
      if (index !== -1) {
        return this.arrayMotivo[index].descripcion;
      }
    }
    return valor;
  }
}
