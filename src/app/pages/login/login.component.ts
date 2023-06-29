import { ApiRestService } from './../../service/api-rest.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { trim } from 'lodash';
import { AuthServiceService } from 'src/app/service/auth-service.service';
import { LoginServiceService } from 'src/app/service/login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(public api: ApiRestService,public auth:LoginServiceService,public router:Router,private guard:AuthServiceService) { }

  usuario = {
    nombreUsuario: '',
    contrasena: '',
    empresa:''
  }
  recordarme = false;
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.usuario.empresa=localStorage.getItem('emp');
      this.usuario.nombreUsuario = localStorage.getItem('user');
      this.recordarme=true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) { return; }
    var formulario:any=this.usuario;
    formulario.empresa=trim(formulario.empresa).toLowerCase();
    formulario.nombreUsuario=trim(formulario.nombreUsuario).toLowerCase();
    formulario.contrasena=trim(formulario.contrasena).toLowerCase();
    Swal.showLoading();
    this.auth.login(formulario).subscribe((res:any) => {
    this.validarUsuario(res);
    }, err => {
      Swal.fire({ icon: 'warning', text: 'hubo un error en la conexion al servidor' });
    });

  }

/*   this.api.obtenerPermisoToken().subscribe((res: any) => {
    this.token = res[0].token;} */
  validarUsuario(res:any){
    if (Object.entries(res).length > 0) {
      if (this.recordarme) {
        localStorage.setItem('user', this.usuario.nombreUsuario);
        localStorage.setItem('emp', this.usuario.empresa.toLowerCase());

      }else{
        localStorage.removeItem('user');
        localStorage.removeItem('emp');
      }
      Swal.close();
      this.guard.SessionSaved(res.token);
      this.guard.UserSaved(res.usuario);
      // localStorage.setItem('token',res.token);
      localStorage.setItem('emp',this.usuario.empresa.toLowerCase());
      this.api.getMenu().subscribe((a:any)=>{
        if((a??"")==""){
           return Swal.fire({
          title: 'Mensaje',
          icon: 'warning',
          text: 'Las rutas no han sido configuradas'
        })
        }
        if(a.length>0){
          return this.router.navigateByUrl(a[0].ruta);
        }
      })
    } else {
      return Swal.fire({
        title: 'Mensaje',
        icon: 'warning',
        text: 'No se encontro ningun usuario'
      })
    }
  }
}
