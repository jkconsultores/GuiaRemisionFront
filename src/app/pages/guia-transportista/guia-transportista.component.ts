import { chofer } from './../../interface/choferSec';
import { producto } from './../../interface/producto';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { transportista } from '../../interface/transportista';
import { ApiRestService } from 'src/app/service/api-rest.service';
import { origen } from 'src/app/interface/origen';
import { choferSec1 } from 'src/app/interface/chofer';
import { adquiriente } from 'src/app/interface/adquiriente';
import { destinatario } from 'src/app/interface/destinatario';
import { ApiTransportistaService } from 'src/app/service/api-transportista.service';
import { serie } from 'src/app/interface/serie';
import { AAA_EMPRESA } from 'src/app/interface/Empresa';
import { AAA_DESTINO } from 'src/app/interface/destino';
import { GuiaImportada } from 'src/app/interface/GuiaImportada';
import { GuiaImportadaDetalle } from 'src/app/interface/GuiaImportadaDetalle';
import { docRef } from 'src/app/interface/docRef';
import { camposOpcionales } from '../../interface/camposOpcionales';
import { T_Vehiculo, VehiculoDTO } from 'src/app/interface/Vehiculos';
import { transporteTerceario } from '../../interface/transporteTerceario';

@Component({
  selector: 'app-guia-transportista',
  templateUrl: './guia-transportista.component.html',
  styleUrls: ['./guia-transportista.component.scss']
})
export class GuiaTransportistaComponent  implements OnInit{
  pageProduct=0;
  transportista= {} as transportista;
  fecha_emision = this.fechaActual();
  fecha_traslado = this.fechaActual().substring(0, 10);
  horaEmision = new Date(this.fecha_emision).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  desde=this.fechaActual();
  hasta=this.fechaActual();
  pageGuia=0;
  pageProductGuia=0;
  filtroGuia='';
  cabecera={}

  //producto modal------------------------------------------
  codigoProd = '';
  cantidadProd = '1';
  medidaProd = 'NIU';
  descripcionProd=''
  //datos adicionales chofer placas
  placaChofer = '';
  placaCarreta = '';
  modeloCarreta='';
  marcaVehiculo='';

    //mtc
    tarjetaUnicaCirculacionPrin='';
    tarjetaUnicaCirculacionSec1='';

  //campos opcionales
  camposOpcionales={almacen:'',referencia:'',servicio:'',ticket:'',tipo:''} as camposOpcionales;

  //filtro inputs
  filterTransportista='';
  filterOrigen='';
  filterDestinatario='';
  filterProducto='';
  filterDestino='';
  filterChofer='';
  filterChoferSec='';
  filterVehiculo='';
  filterVehiculoSec=''
  //tablas
  tablaEmpresas = [];
  tablaOrigenes = [];
  tablaSeries:serie[] = [];
  arraySerie = [];
  arrayGuiasImportadas:GuiaImportada[]=[]
  arrayGuiasImportadasCabecera= [];
  arrayGuiasImportadasDetalle:GuiaImportadaDetalle[]=[];
  //arreglos
  destinos = [];
  origenes = [];
  guias=[];
  destinatarios=[];
  transportistas=[];
  empresas = [];
  choferes = [];
  selectedGuias:GuiaImportada[]=[]
  // variable para formulario crud destinatario select tipo doc
  tipodocForm = '1';
  tipodocTrans = '6';
  tipodocChofer = '1';
  correlativo = 1;
  //destinatario
  destinatario={razonsocialadquiriente:''} as destinatario;
  //remitente
  remitente={razonsocialemisor:''} as AAA_EMPRESA;
  //origen
  origen = {} as origen;
  //destino
  destino={} as AAA_DESTINO;
  //chofer
  chofer={nombre:''} as chofer;
  //chofersec
  choferSec={nombre:''} as chofer;
  //transporteTerceario
  transporteTerceario={indTransporteSubcontratado:true,numeroDocSubcontratista:'',razonSocialSubcontratista:'',tipoDocumentoSubcontratista:'6'} as transporteTerceario;
  public VehiculosActivos:T_Vehiculo[]=[];

  pais = 'PE';
  tipodocEmp = '6';
  //variables por defecto
  medidas = [{ id: 'KGM', text: 'KGM' }, { id: 'NIU', text: 'NIU' }]
  medida = 'KGM';
  modalRef: NgbModalRef;
  listadoProductoDetalles:producto[] = [];//todos los detalles de la guia de remision


  //doc relacionado
  tipoDocumentoDocRel='01';
  documentosReferenciados:docRef[]=[];
  tipoDocumentoEmisorDocRel='6';
  motivoTraslado='';
  descripcionMotivoTraslado='';
  modalidadTraslado='';
  unidadMedidaPesoBruto='';

 ubigeoDestinoUpdate = '';
 direccionDestinoUpdate = '';
 codigolocalanexoUpdate = '';
 destinatarioObject: adquiriente;
   //destino modal-------------------------------------------
   ubigeoDestino = '';
   direccionDestino = '';
   codigolocalanexo = '';
   contador = 0;
  //Guia de remision----------------------------------------
  empresaid = '';
  serieNumero='';
  observaciones = '';
  pesoBruto = '';
  Nrobultos = '';


  constructor(private modalService: NgbModal,public api: ApiRestService,public apiT:ApiTransportistaService,){
      this.getTransportistaDefault();
      this.getChofer()
      this.obtenerVehiculos();
  }
  ngOnInit(): void {
    let div1 = document.getElementById("botonesdeacceso");
   let div2 = document.getElementById("secondarslot");
   let div3 = document.getElementById("principalslot");
    if(window.innerWidth < 900){
      div2.appendChild(div1);
      div3.removeChild(div1);
    }else{
      div3.appendChild(div1);
      div2.removeChild(div1);
    }
  }
  fechaActual() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hours = now.getHours() - 5;
    const minutes = now.getMinutes();
    const isoString = new Date(year, month, day, hours, minutes).toISOString().slice(0, -8);
    return (isoString);
  }
  validarDecimal(event: KeyboardEvent) {
    if (event.charCode !== 0) {
      const pattern = /[0-9.]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  listarEmpresas(empresa) {
    Swal.showLoading();
    this.api.getEmpresas().subscribe((res: any) => {
      Swal.close();
      this.tablaEmpresas = res;
      this.abrirModal(empresa);
    });
  }
  validarNumero(event: KeyboardEvent) {
    if (event.charCode !== 0) {
      const pattern = /[0-9]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
  }
  abrirModal(ModalTemplate) {
    this.modalRef = this.modalService.open(ModalTemplate, { size: 'lg' });
  }
  cerrarModal(){
    this.modalRef.close();
  }
  salir() {
    this.modalRef.close();
  }
  borrarListadoProductoDetalles(codigo, descripcion, cantidad, unidadmedida) {
    const indice = this.listadoProductoDetalles.findIndex((elemento) => elemento.codigo == codigo && elemento.descripcion == descripcion && elemento.cantidad == cantidad && elemento.unidadmedida == unidadmedida);
    this.listadoProductoDetalles.splice(indice, 1);
  }
  asignarTransportista(transportista:transportista) {
     this.transportista=transportista;
     this.apiT.getSerie(transportista.numerodocumentotransportista).subscribe((res: any) => {
      this.arraySerie = res;
    });
     this.modalService.dismissAll();
   }
   borrarTransportista(ndoc) {
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'El Transportista con el N° Doc ' + ndoc + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.BorrarTransportista(ndoc).subscribe((res: any) => {
         this.getTransportista();
          this.limpiarTransportista();
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })
  }
  getTransportista(){
    this.api.getTransportista().subscribe((res: any) => {
      Swal.close();
      this.transportistas = res;
    });
  }
  getTransportistaDefault(){
    this.api.getTransportista().subscribe((res: any) => {
      Swal.close();
      if((res??"")!=""&&res.length==1){
        this.transportista=res[0];
        this.apiT.getSerie(this.transportista.numerodocumentotransportista).subscribe((res: any) => {
          this.arraySerie = res;
          if((res??"")!=""&&res.length==1){
            this.serieNumero=res[0].serie;
          }

        });
      }
      this.transportistas = res;
    });
  }
  limpiarTransportista(){
    this.transportista={} as transportista;
  }
  crearTransportista(form: NgForm) {
    if (form.invalid) {
      return
    }
    if (form.submitted) {
      Swal.showLoading();
      this.api.crearTransportista(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.getTransportista();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
      })
    }
  }
  borrarOrigen(origen:origen) {
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'El Origen con el N° Doc ' + origen.numerodocumentoemisor + ' y ubigeo '+origen.ubigeoorigen+' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var obj = { numerodocumentoemisor: origen.numerodocumentoemisor, ubigeoorigen: origen.ubigeoorigen, direccionorigen: origen.direccionorigen }
        this.api.BorrarOrigen(obj).subscribe((res: any) => {
          this.api.getOrigen().subscribe((res: any) => {
            Swal.close();
            this.origenes = res;
          });
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })

  }
  crearOrigen(form) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      this.api.CrearOrigen(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.api.getOrigen().subscribe((res: any) => {
          this.origenes = res;
        });
        // this.empresa = '';
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }

  }
  crearEmpresa(form: NgForm) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      this.api.crearEmpresa(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.api.getEmpresas().subscribe((res: any) => {
          this.tablaEmpresas = res;
        });
        this.getTransportista();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  }
  borrarEmpresa(ndoc) {
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'La empresa con el N° Doc ' + ndoc + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.BorrarEmpresa(ndoc).subscribe((res: any) => {
          this.api.getEmpresas().subscribe((res: any) => {
            Swal.close();
            this.tablaEmpresas = res;
          });
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })
  }
  borrarSerie(numDoc, serie) {
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'La serie '+serie+' con el N° Doc ' + numDoc + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.BorrarSerie(numDoc, serie).subscribe((res: any) => {
          this.apiT.getSerie(this.transportista.numerodocumentotransportista).subscribe((res: any) => {
            Swal.close();
            this.tablaSeries = res;
          });
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })

  }
  crearSerie(form) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      form.value.SERIE = form.value.SERIE.toUpperCase();
      this.api.CrearSerie(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.apiT.getSerie(this.transportista.numerodocumentotransportista).subscribe((res: any) => {
          this.tablaSeries = res;
        });
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  }
  crearAdquiriente(form: NgForm) {
    if (form.invalid) {
      return
    }
    if (form.submitted) {
      Swal.showLoading();
      form.value.destino = this.destinos;
      this.api.crearAdquiriente(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.destinos = [];
        this.modalRef.close();
        this.getTransportista();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  }
  crearFilas() {
    if (this.ubigeoDestino == '' || this.direccionDestino == '') {
      return Swal.fire({ icon: 'error', title: 'Complete los campos' });
    }
    var obj = {
      id: this.contador,
      ubigeodestino: this.ubigeoDestino,
      direcciondestino: this.direccionDestino,
      codigolocalanexo:this.codigolocalanexo
    }
    this.destinos.push(obj);
    this.ubigeoDestino = '';
    this.direccionDestino = '';
    this.codigolocalanexo = '';
    this.contador++;
  }
  crearFilasUpdate() {
    if (this.ubigeoDestinoUpdate == '' || this.direccionDestinoUpdate == '') {
      return Swal.fire({ icon: 'error', title: 'Complete los campos' });
    }
    var obj = {
       id: this.contador,
       ubigeodestino: this.ubigeoDestinoUpdate,
       direcciondestino: this.direccionDestinoUpdate,
       codigolocalanexo: this.codigolocalanexoUpdate
      }
    this.destinatarioObject.destinos.push(obj);
    this.ubigeoDestinoUpdate = '';
    this.direccionDestinoUpdate = '';
    this.codigolocalanexoUpdate = '';
    this.contador++;
  }
  asignarDestinatario(destinatario:destinatario) {
    Swal.showLoading();
    this.destinatario=destinatario;
    this.modalService.dismissAll();
    this.apiT.getDestinosByRuc(destinatario.numerodocumentoadquiriente).subscribe((res:any)=>{
      this.destinos=res;
      Swal.close();
    },err=>{
      Swal.close();
    })
  }
  EditarDestinatario(modal, contenido) {
    console.log(contenido)
    this.destinatarioObject = contenido;
    this.abrirModal(modal);
  }
  asignarRemitente(remitente:AAA_EMPRESA){
    Swal.showLoading();
    this.remitente=remitente;
    this.apiT.getOrigenes(remitente.numerodocumentoemisor.toString()).subscribe((res:any)=>{
      this.origenes=res;
      Swal.close();
    },err=>{
      Swal.close();
    })
    this.modalRef.close();
  }
  updateAdquiriente(form: NgForm) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      form.value.DESTINO = this.destinatarioObject.destinos;
      this.api.updateAdquiriente(form.value).subscribe((res: any) => {
        this.modalRef.close();
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.destinatarioObject.destinos = [];
        this.getTransportista();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  }
  borrarDestinoArray(id) {
    const indice = this.destinos.findIndex((elemento) => elemento.id === id);
    this.destinos.splice(indice, 1);
  }
  borrarDestinoArrayUpdate(id) {
    const indice = this.destinatarioObject.destinos.findIndex((elemento) => elemento.id === id);
    this.destinatarioObject.destinos.splice(indice, 1);
  }
  listarSerie(serie) {
    if(this.transportista.numerodocumentotransportista??""!=""){
      Swal.showLoading()
      this.apiT.getSerie(this.transportista.numerodocumentotransportista).subscribe((res: any) => {
        Swal.close();
        this.abrirModal(serie);
        this.tablaSeries = res;
      },err=>{
        Swal.close();
      });
    }
  }
  listarOrigen(origen) {
    Swal.showLoading();
    this.api.getOrigen().subscribe((res: any) => {
      this.abrirModal(origen);
      this.tablaOrigenes = res;
      Swal.close();
    },err=>{
      Swal.close();
    });

  }
  asignarOrigen(origen:origen){
    this.origen=origen;
    this.modalRef.close();
  }
  getDestinatarios(){
    Swal.showLoading();
    this.apiT.getDestinatario().subscribe((res:any)=>{
      this.destinatarios=res
      Swal.close();
    },err=>{
      Swal.close();
    })
  }
  asignarDestino(destino:AAA_DESTINO){
    this.destino=destino;
    this.modalRef.close();
  }
  importarGuias(){
    if((this.remitente.numerodocumentoemisor??"")==""){
      return Swal.fire({ icon: 'warning', title: 'Seleccione un remitente', text: 'Para la busqueda de guias el campo remitente es necesario!' });
    }
    this.apiT.getImportarGuiasTransportista(this.remitente.numerodocumentoemisor).subscribe((res:any)=>{
      this.arrayGuiasImportadas=res;
    })
  }
  declararGuia() {
    if (this.serieNumero == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'El campo serie y número esta vacio!' });
    }
    if ((this.origen.direccionorigen??"")=="") {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un Punto de partida!' });
    }
    if ((this.destino.direcciondestino??"")=="") {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un Punto de llegada!' });
    }
    if ((this.remitente.razonsocialemisor??"")=="") {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un remitente!' });
    }
    if ((this.destinatario.razonsocialadquiriente??"")=="") {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un destinatario!' });
    }
    if (this.medida == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione una medida!' });
    }
    if (this.pesoBruto == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'El campo peso bruto es requerido!' });
    }
    if(this.validarDecimales(parseFloat(this.pesoBruto))){
      return Swal.fire({ icon: 'warning', title: 'Corregir Campo', text: 'El campo peso bruto solo se admite hasta 3 decimales!' });
    }
    if (this.Nrobultos != '' && Number.isNaN(this.Nrobultos)) {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'El campo N° Bultos debe ser numerico!' });
    }
    if (this.listadoProductoDetalles.length == 0) {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Esta guia no tiene Detalles!' });
    }
    for (var i = 0; i < this.listadoProductoDetalles.length; i++) {
      if (this.listadoProductoDetalles[i].unidadmedida.length > 3) {
        return Swal.fire({ icon: 'warning', title: 'Algunos de los productos no tienen unidades de medida válidas según SUNAT.!', text: 'Unidad de medida no puede tener un ancho mayor a 3!' });
      }
    }
    var obj = this.llenarGuia();
    Swal.showLoading();
    this.apiT.declararGuia(obj).subscribe((res: any) => {
      Swal.fire({ icon: 'success', title: 'Se creó con éxito',text:res }).then(res => {
        window.location.reload();
      })
    }, err => {
      if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
      else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
    })
  }
  validarDecimales(num:Number){
    const numString = num.toString();
    const match = numString.match(/\.(\d{4,})/);
    return match !== null && match[1].length > 3;
  }
  llenarGuia() {
    var obj = {
      tipoDocumentoRemitente: this.remitente.tipodocumentoemisor,
      numeroDocumentoRemitente: this.remitente.numerodocumentoemisor,
      serieNumeroGuia: this.serieNumero+'-1',
      fechaEmisionGuia: this.fecha_emision.substring(0, 10), //solo date yyyy-mm-dd
      observaciones: this.observaciones,
      razonSocialRemitente: this.remitente.razonsocialemisor, //razonsocialemisor empresa
      correoRemitente:'-',
      correoDestinatario: this.destinatario.correo??"-",
      numeroDocumentoDestinatario: this.destinatario.numerodocumentoadquiriente,
      tipoDocumentoDestinatario: this.destinatario.tipodocumentoadquiriente,
      razonSocialDestinatario: this.destinatario.razonsocialadquiriente,
      motivoTraslado: '',//this.motivoTraslado,
      descripcionMotivoTraslado: this.descripcionMotivoTraslado,
      indTransbordoProgramado: '',
      pesoBrutoTotalBienes: parseFloat(this.pesoBruto).toString(),
      unidadMedidaPesoBruto: this.medida,
      modalidadTraslado: '',//this.modalidadTraslado, //01 publico 02 privado
      fechaInicioTraslado: this.fecha_traslado,
      numeroRucTransportista: (this.transportista.numerodocumentotransportista??"")==""?"":this.transportista.numerodocumentotransportista,
      tipoDocumentoTransportista: (this.transportista.tipodocumentotransportista??"")==""?"":this.transportista.tipodocumentotransportista,
      razonSocialTransportista: (this.transportista.razonsocialtransportista??"")==""?"":this.transportista.razonsocialtransportista,
      numeroDocumentoConductor: (this.chofer.numerodocumentochofer??"")==""?"":this.chofer.numerodocumentochofer,
      tipoDocumentoConductor: (this.chofer.tipodocumentochofer??"")==""?"":this.chofer.tipodocumentochofer,
      numeroPlacaVehiculoPrin: this.placaChofer, //conductor chofer
      numeroBultos: this.Nrobultos,
      ubigeoPtoLLegada: this.destino.ubigeodestino??"", //destino
      codigoPtollegada: this.destino.codigolocalanexo??"",
      codigoPtoPartida: this.origen.codigolocalanexo??"",
      direccionPtoLLegada: this.destino.direcciondestino, //destino
      ubigeoPtoPartida: this.destino.ubigeodestino, //origen
      direccionPtoPartida: this.origen.direccionorigen, //origen
      horaEmisionGuia: this.horaEmision, //solo hora!! hh:mm:ss
      fechaEntregaBienes: this.fecha_traslado, //fecha de entrega solo DATE
      numeroRegistroMTC: "",//puede estar en blanco
      nombreConductor: (this.chofer.nombre??"")==""?"":this.chofer.nombre,
      apellidoConductor: (this.chofer.apellido??"")==""?"":this.chofer.apellido,
      numeroLicencia: (this.chofer.brevete??"")==""?"":this.chofer.brevete, //chofer
      spE_DESPATCH_ITEM: this.listadoProductoDetalles,
      SPE_DESPATCH_DOCRELACIONADO:this.documentosReferenciados,
      numeroDocumentoConductorSec1:this.choferSec.numerodocumentochofer,
      tipoDocumentoConductorSec1:this.choferSec.tipodocumentochofer,
      nombreConductorSec1:(this.choferSec.nombre??"")==""?"":this.choferSec.nombre,
      apellidoConductorSec1 :(this.choferSec.apellido??"")==""?"":this.choferSec.apellido,
      numeroLicenciaSec1:(this.choferSec.brevete??"")==""?"":this.choferSec.brevete,
      camposOpcionales1: (this.camposOpcionales??null),
      textoAuxiliar250_1:this.placaCarreta,//placa carreta
      textoAuxiliar250_3:this.modeloCarreta,//modelo carreta,
      textoAuxiliar250_2:this.marcaVehiculo, // modelo del vehiculo
      datosDeTrasporteTercerizado:((this.transporteTerceario.razonSocialSubcontratista??"")=="")||((this.transporteTerceario.numeroDocSubcontratista??"")=="")?null:this.transporteTerceario,
      tarjetaUnicaCirculacionPrin:this.tarjetaUnicaCirculacionPrin??"",
      tarjetaUnicaCirculacionSec1:this.tarjetaUnicaCirculacionSec1??""
    }
    return obj;
  }
asignarGuiaImportada(guia:GuiaImportada){
  const checkbox = document.getElementById(guia.serieNumeroGuia + guia.numeroDocumentoRemitente) as HTMLInputElement;
  if (checkbox.checked) {
    this.selectedGuias.push(guia);
  } else {
    const index = this.selectedGuias.indexOf(guia);
    if (index > -1) {
      this.selectedGuias.splice(index, 1);
    }
  }
}
cerrarModalGuiasImportadas(){
  this.modalService.dismissAll();
  this.arrayGuiasImportadas=[];
  this.selectedGuias=[];
}
asignarGuiasImportadas(){
 this.arrayGuiasImportadasCabecera= this.selectedGuias.map(item => {
    return { serieNumeroGuia: item.serieNumeroGuia, numeroDocumentoRemitente: item.numeroDocumentoRemitente,fechaEmision:item.fechaEmision };
  });
  this.modalService.dismissAll();
  var nuevoArreglo=this.convertirFormatoArreglo(this.selectedGuias);
  this.apiT.getImportarDetallesGuiasTransportista(nuevoArreglo).subscribe((a:any)=>{
      this.convertirFormatoProducto(a);
  })
  if(this.selectedGuias.length>0){
   this.extraerGuiaImportada(this.selectedGuias[0]);
  }
  this.arrayGuiasImportadas=[];
  this.selectedGuias=[];
}
abrirModalEvitarCerrar(ModalTemplate) {
  return this.modalService.open(ModalTemplate, { size: 'lg' ,backdrop:'static'});
}
convertirFormatoArreglo(array:GuiaImportada[]){
  var nuevoArray=[]
  array.forEach(element => {
   nuevoArray.push({ruc:element.numeroDocumentoRemitente,serieYCorrealtivo:element.serieNumeroGuia})
  });
  return nuevoArray;
}
convertirFormatoProducto(array:any){
  this.listadoProductoDetalles=[];
  array.forEach(element => {
    this.listadoProductoDetalles.push({cantidad:element.cantidad,codigo:element.codigo,descripcion:element.descripcion,unidadmedida:element.unidad})
  });
}
extraerGuiaImportada(guia:GuiaImportada){

  this.remitente={
    razonsocialemisor:guia.razonSocialRemitente,
    numerodocumentoemisor:guia.numeroDocumentoRemitente,
    tipodocumentoemisor:guia.tipoDocumentoRemitente,
  };
  this.origen={
    direccionorigen:guia.direccionPtoPartida,
    numerodocumentoemisor:guia.numeroDocumentoRemitente,
    ubigeoorigen:guia.ubigeoPtoPartida,
    codigolocalanexo:guia.codigoPtoPartida
  }
  this.destinatario={
  razonsocialadquiriente:guia.razonSocialDestinatario,
  tipodocumentoadquiriente:guia.tipoDocumentoDestinatario,
  numerodocumentoadquiriente:guia.numeroDocumentoDestinatario,
  }
  this.destino={
    direcciondestino:guia.direccionPtoLlegada,
    numerodocumentoadquiriente:guia.numeroDocumentoDestinatario,
    ubigeodestino:guia.ubigeoPtoLLegada,
    codigolocalanexo:guia.codigoPtoLLegada
  }
  const totalPesobruto = this.selectedGuias.reduce((total, objeto) => {
    const pesobruto = parseFloat(objeto.pesoBruto);
    return total + (isNaN(pesobruto) ? 0 : pesobruto);
  }, 0);

  const totalBultos = this.selectedGuias.reduce((total, objeto) => {
    const numeroBultos = objeto.numeroBultos;
    const bultos = (typeof numeroBultos === 'number' || (typeof numeroBultos === 'string' && numeroBultos.trim() !== '')) ? parseFloat(numeroBultos) : 0;
    return total + (isNaN(bultos) ? 0 : bultos);
  }, 0);
  this.motivoTraslado=guia.modalidadTraslado;
  this.descripcionMotivoTraslado=guia.descripcionMotivo;
  this.modalidadTraslado=guia.modalidadTraslado;
  this.unidadMedidaPesoBruto=guia.unidadMedidaPeso;
  this.pesoBruto=totalPesobruto.toString()??"0";
  this.Nrobultos=totalBultos.toString()??"";
  this.medida=guia.unidadMedidaPeso;
  this.convertirFormatoDocFef();
}
convertirFormatoDocFef(){
 this.documentosReferenciados=[];
  this.selectedGuias.forEach(element=>{
    this.documentosReferenciados.push({
      codigoDocumentoDocRel:element.tipoDocumentoGuia,
      numeroDocumentoDocRel:element.serieNumeroGuia,
      numeroDocumentoEmisorDocRel:element.numeroDocumentoRemitente,
      tipoDocumentoDocRel:element.tipoDocumentoGuia,
      tipoDocumentoEmisorDocRel:element.tipoDocumentoRemitente
    })
  })
}
asignarProducto() {
  if((this.codigoProd??"")==""||(this.cantidadProd??"")==""||(this.medidaProd??"")==""||(this.descripcionProd??"")==""){
    return Swal.fire({icon:'warning',title:'Complete los campos!'});
  }
  let objeto:producto={cantidad:this.cantidadProd.toString(),codigo:this.codigoProd.toString(),descripcion:this.descripcionProd.toString(),unidadmedida:this.medidaProd.toString()};
  this.listadoProductoDetalles.push(objeto);
}
asignarChofer(chofer:chofer) {
  this.chofer=chofer;
  this.modalService.dismissAll();
}
asignarChoferSec(choferSec:chofer) {
  this.choferSec=choferSec;
  this.modalService.dismissAll();
}
borrarChofer(ndoc){
  Swal.showLoading();
  Swal.fire({
    icon:'warning',
    title: 'Estás seguro?',
    text: 'El Chofer con el N° Doc ' + ndoc + ' se eliminará',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    confirmButtonColor:'red',
    cancelButtonText: 'Salir'
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      this.api.BorrarChofer(ndoc).subscribe((res: any) => {
         this.getChofer();
         this.chofer={} as chofer;
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  })
}
getChofer(){
  this.api.getChofer().subscribe((res:any)=>{
    this.choferes=res;
  })
}
asignarVehiculo(placa,marca,mtc){
  this.marcaVehiculo=marca;
  this.placaChofer=placa;
  this.tarjetaUnicaCirculacionPrin=mtc;
  this.modalRef.close();
}
asignarCarreta(placa,marca,mtc){
  this.placaCarreta=placa;
  this.modeloCarreta=marca;
  this.tarjetaUnicaCirculacionSec1=mtc;
  this.modalRef.close();
}
crearChofer(form: NgForm) {
  if (form.invalid) {
    return
  }
  if (form.submitted) {
    Swal.showLoading();
    let valueform = form.value;
    let chofer:chofer ={
      apellido : valueform.APELLIDO,
      brevete:valueform.BREVETE,
      nombre:valueform.NOMBRE,
      numerodocumentochofer: valueform.numerodocumentochofer,
      placavehiculo: '',
      tipodocumentochofer:valueform.TIPODOCUMENTOCHOFER
    } ;
    this.api.crearChofer(chofer).subscribe((res: any) => {
      Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
      this.modalRef.close();
      this.getChofer();
    }, error => {
      if (error.error) { Swal.fire({ icon: 'warning', text: error.error }); }
      else{
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
      }
    })
  }
}
eliminarUnVehiculo(idVehiculo:number, placa:string){
  Swal.fire({
    text:"Estas seguro de eliminar el vehiculo",
    icon:"warning",
    title:"Eliminar el vehiculo con placa: "+placa,
    showCancelButton: true,
    confirmButtonText: 'Eliminar vehiculo',
    cancelButtonText:"cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      this.api.BorrarVehiculos(idVehiculo).subscribe(resp=>{
        Swal.fire('Eliminado!', '', 'success')
        this.obtenerVehiculos();
      },error=>{
        Swal.fire('No se pudo eliminar el vehiculo', '', 'error')
      })
    }
  })
}
obtenerVehiculos(){
  this.api.getVehiculos().subscribe((resp:any)=>{
    this.VehiculosActivos=resp;
  })
}
onKeyPress(event: KeyboardEvent): void {
  if (event.key === '-' ) {
    event.preventDefault(); // Evita que se ingrese el guion
  }
}
agregarVehiculo(ref: NgForm){
  let vehiculo:VehiculoDTO={
    color:ref.value.colorVehiculo,
    marca:ref.value.marcaVehiculo,
    modelo:ref.value.modeloVehiculo,
    placaVehiculo:ref.value.placaVehiculoVehiculo,
  };
  this.api.AgregarVehiculo(vehiculo).subscribe((resp:any)=>{
    this.VehiculosActivos.push(resp);

    Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
      this.modalRef.close();
  })
}

}
