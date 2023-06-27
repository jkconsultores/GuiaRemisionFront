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
  public getSerie(ruc:string){
    return this.http.get(this.url+'Aaa/getSerie/tipo/31/'+ruc,this.auth.obtenerDatos());
  }
  public getOrigenes(ndoc:string){
    return this.http.post(this.url+'GreTransportista/Origenes',[ndoc],this.auth.obtenerDatos())
  }
  public getDestinatario(){
    return this.http.get(this.url+'GreTransportista/Destinatario',this.auth.obtenerDatos())
  }
  public getDestinosByRuc(ndoc){
    return this.http.post(this.url+'GreTransportista/Destino',[ndoc],this.auth.obtenerDatos())
  }
  public getImportarGuiasTransportista(ndoc){
    return this.http.get(this.url+'GreTransportista/NumeroDocumentoTranpsortista/'+ndoc,this.auth.obtenerDatos())
  }
  public getImportarDetallesGuiasTransportista(array){
    return this.http.post(this.url+'GreTransportista/ObtenerGuias',array,this.auth.obtenerDatos())
  }
  public declararGuia(guia){
    return this.http.post(this.url+'GreTransportista',guia,this.auth.obtenerDatos())
  }
}
