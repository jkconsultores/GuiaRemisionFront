import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTransportistaService {
  httpOptions:any |undefined
  constructor(public http:HttpClient,private auth:AuthServiceService) {

  }
  private url=environment.urlApi;
  public getTipoDocumento(){
    return this.http.get(this.url+'AAA',this.auth.obtenerDatos());
  }
}
