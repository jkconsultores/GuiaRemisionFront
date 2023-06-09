import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AAA_EMPRESA } from '../interface/Empresa';
import { AuthServiceService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class ApiRestService implements OnInit{
  httpOptions:any |undefined
  constructor(public http:HttpClient,private auth:AuthServiceService) {

  }
  ngOnInit(): void {

  }
   private url=environment.urlApi;
   //url='https://localhost:7224/api/';
   //url='https://jk-smart.com:201/api/';

  public getInfo(){
    return this.http.get(this.url+'AAA',this.auth.obtenerDatos());
  }
  public crearAdquiriente(form){
    return this.http.post(this.url+'AAA',form,this.auth.obtenerDatos())
  }
  public updateAdquiriente(form){
    return this.http.post(this.url+'AAA/UpdateAdquiriente',form,this.auth.obtenerDatos())
  }
  public crearTransportista(form){
    return this.http.post(this.url+'AAA/transportista',form,this.auth.obtenerDatos())
  }
  public crearChofer(form){
    return this.http.post(this.url+'AAA/chofer',form,this.auth.obtenerDatos())
  }
  public getDestinos(form){
    return this.http.post(this.url+'AAA/GetDestino',form,this.auth.obtenerDatos());
  }
  public getProductos(){
    return this.http.get(this.url+'Producto',this.auth.obtenerDatos());
  }
  //obtener origenes para mostrar en el select
  public getOrigenes(id,local){
    return this.http.get(this.url+'AAA/GetOrigen/'+id+'/'+local,this.auth.obtenerDatos());
  }
  public declararGuia(form){
    return this.http.post(this.url+'SPE_DESPATCH/declarar',form,this.auth.obtenerDatos());
  }
  public getSpe_despatch(desde,hasta){
    return this.http.get(this.url+'SPE_DESPATCH/SPE_DESPATCH/'+desde+'/'+hasta,this.auth.obtenerDatos());
  }
  public getSpe_despatch_item(serie){
    return this.http.get(this.url+'SPE_DESPATCH/SPE_DESPATCH_ITEM/'+serie,this.auth.obtenerDatos())
  }
  public crearProducto(producto){
    return this.http.post(this.url+'AAA/Producto',producto,this.auth.obtenerDatos())
  }
  public borrarProducto(codigo:string){
    return this.http.get(this.url+'AAA/BorrarProducto/'+codigo,this.auth.obtenerDatos());
  }
  public crearEmpresa(empresa:AAA_EMPRESA){
    return this.http.post(this.url+'AAA/Empresa',empresa,this.auth.obtenerDatos());
  }
  public getEmpresas(){
    return this.http.get(this.url+'AAA/GetEmpresas',this.auth.obtenerDatos());
  }
  //obtener origenes para mostrar en la tabla
  public getOrigen(){
    return this.http.get(this.url+'AAA/GetOrigenes',this.auth.obtenerDatos());
  }
  public CrearOrigen(form){
    return this.http.post(this.url+'AAA/CrearOrigen',form,this.auth.obtenerDatos());
  }
  public getSerie(){
    return this.http.get(this.url+'AAA/getSerie',this.auth.obtenerDatos());
  }
  public CrearSerie(form){
    return this.http.post(this.url+'AAA/CrearSerie',form,this.auth.obtenerDatos());
  }
  public BorrarSerie(numdoc,serie){
    return this.http.get(this.url+'AAA/BorrarSerie/'+numdoc+'/'+serie,this.auth.obtenerDatos());
  }
  public BorrarEmpresa(numdoc){
    return this.http.get(this.url+'AAA/BorrarEmpresa/'+numdoc,this.auth.obtenerDatos());
  }
  public BorrarOrigen(form){
    return this.http.post(this.url+'AAA/BorrarOrigen',form,this.auth.obtenerDatos());
  }
  public BorrarTransportista(ndoc){
    return this.http.get(this.url+'AAA/BorrarTransportista/'+ndoc,this.auth.obtenerDatos());
  }
  public getTransportista(){
    return this.http.get(this.url+'AAA/getTransportista',this.auth.obtenerDatos());
  }
  public BorrarChofer(ndoc){
    return this.http.get(this.url+'AAA/BorrarChofer/'+ndoc,this.auth.obtenerDatos());
  }
}
