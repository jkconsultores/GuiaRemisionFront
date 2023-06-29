import { ReporteTransportistaComponent } from './pages/reporte-transportista/reporte-transportista.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { FacturacionElectronicaComponent } from './pages/facturacion-electronica/facturacion-electronica.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroDeUsuariosComponentComponent } from './pages/usuarios/registro-de-usuarios-component/registro-de-usuarios-component.component';
import { GuiaTransportistaComponent } from './pages/guia-transportista/guia-transportista.component';

const routes: Routes = [
  {path:'main',component:MainComponent,canActivate:[AuthGuard]},
  {path:'',component:MainComponent,canActivate:[AuthGuard]},
  {path:'login',component:LoginComponent},
/*   {path:'facturacion',component:FacturacionElectronicaComponent,canActivate:[AuthGuard]}, */
  {path:'reporte',component:ReporteComponent,canActivate:[AuthGuard]},
  {path:'gre-transportista',component:GuiaTransportistaComponent,canActivate:[AuthGuard]},
  {path:'reporte-transportistas',component:ReporteTransportistaComponent,canActivate:[AuthGuard]},
  {path:'registro/usuarios',component:RegistroDeUsuariosComponentComponent,canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
