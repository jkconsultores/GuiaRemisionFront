import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AAA_EMPRESA } from '../interface/Empresa';
import { AuthServiceService } from './auth-service.service';
import { T_Vehiculo, VehiculoDTO } from '../interface/Vehiculos';
import { AAA_TIPODOCUMENTO, urlANdTipo } from '../interface/aaa_TipoDocumento';
import { MOTIVOS } from '../interface/Motivos';
import { USUARIO, UsuariosDTO } from '../interface/Usuario';
import { PermisoDTO, T_Permiso } from '../interface/Permiso';
import { RespuestaDeLLaveValor } from '../interface/RespuestasGenericas';
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
  // public getOrigenesByRuc(ndoc:string){
  //   return this.http.post(this.url+'GreTransportista/Origenes',[ndoc],this.auth.obtenerDatos())
  // }
  public getMenu(){
    return this.http.get(this.url+'MenuGre',this.auth.obtenerDatos());
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
  public getDestinatario(){
    return this.http.get(this.url+'GreTransportista/Destinatario',this.auth.obtenerDatos())
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
  public getChofer(){
    return this.http.get(this.url+'AAA/Obtener/todos/choferes',this.auth.obtenerDatos());
  }
  public BorrarChofer(ndoc){
    return this.http.get(this.url+'AAA/BorrarChofer/'+ndoc,this.auth.obtenerDatos());
  }
  public getVehiculos(){
    return this.http.get<T_Vehiculo[]>(this.url+'Vehiculo',this.auth.obtenerDatos());
  }
  public AgregarVehiculo(vehiculo:VehiculoDTO){
    return this.http.post<T_Vehiculo>(this.url+'Vehiculo',vehiculo,this.auth.obtenerDatos());
  }
  public BorrarVehiculos(idVehiculo:number){
    return this.http.post(this.url+'Vehiculo/delete/'+idVehiculo,null,this.auth.obtenerDatos());
  }
  public ActualizarVehiculos(vehiculo:T_Vehiculo){
    return this.http.post(this.url+"Vehiculo/update",vehiculo,this.auth.obtenerDatos());
  }
  public getSeries(){
    return this.http.get<AAA_TIPODOCUMENTO[]>(this.url+"NumeroDocumentoEmisor",this.auth.obtenerDatos());
  }
  public getMotivos(){
    return this.http.get<MOTIVOS[]>(this.url+"Motivos",this.auth.obtenerDatos());
  }
  public getUsuarios(){
    return this.http.get<USUARIO[]>(this.url+"Usuario",this.auth.obtenerDatos());
  }
  public deleteUsuario(id:number){
    return this.http.post(this.url+"Usuario/delete/"+id,null,this.auth.obtenerDatos());
  }
  public actualziarContraseña(pass:RespuestaDeLLaveValor){
    return this.http.post(this.url+"Usuario/CangePass",pass,this.auth.obtenerDatos());
  }
  public CambiarAccesoUsuario(pass:RespuestaDeLLaveValor){
    return this.http.post(this.url+"Usuario/access",pass,this.auth.obtenerDatos());
  }
  public agregarUsuario(usuario:UsuariosDTO){
    return this.http.post<USUARIO>(this.url+"Session/Register",usuario,this.auth.obtenerDatos())
  }
  public ObtenerPDFDeFactura(ruta:urlANdTipo){
    return this.http.post<any>(this.url+"GestionDeDocumentos/Descargar",ruta,{headers:{'Content-Type':'application/json','Authorization': 'Bearer '+this.auth.ObtenerSoloBearer()},responseType:'blob' as 'json'});
  }
  public getDestinosByRuc(ndoc){
    return this.http.post(this.url+'GreTransportista/Destino',[ndoc],this.auth.obtenerDatos())
  }
  //solo para 8 sur
  public importarBalanza(ndoc:string,ruc:string,nbalanza:string){
    return this.http.post(this.url+'balanza',{
      "numdoc": ndoc,
      "ruc": ruc,
      "nbalanza": nbalanza
    },this.auth.obtenerDatos())
  }
  public AgregarPermisos(permisos:PermisoDTO[]){
    return this.http.post(this.url+'Roles',permisos,this.auth.obtenerDatos())
  }
  public ActualizarPermisos(permisos:PermisoDTO[]){
    return this.http.post(this.url+'Roles/update',permisos,this.auth.obtenerDatos())
  }
  public ObtenerRolesDeUsuario(usuarioId:number){
    return this.http.get<T_Permiso[]>(this.url+'Roles/'+usuarioId,this.auth.obtenerDatos())
  }
  public VerificarAccesoAUsuario(){
    return this.http.get(this.url+"Usuario/AccesoAUsuarios",this.auth.obtenerDatos())
  }
}
