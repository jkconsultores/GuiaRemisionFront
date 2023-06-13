import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './pages/modal/modal.component';
import { FacturacionElectronicaComponent } from './pages/facturacion-electronica/facturacion-electronica.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe } from './pipes/filter.pipe';
import { ReporteTransportistaComponent } from './pages/reporte-transportista/reporte-transportista.component';
import { RegistroDeUsuariosComponentComponent } from './pages/usuarios/registro-de-usuarios-component/registro-de-usuarios-component.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ModalComponent,
    FacturacionElectronicaComponent,
    NavbarComponent,
    ReporteComponent,
    FilterPipe,
    ReporteTransportistaComponent,
    RegistroDeUsuariosComponentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
