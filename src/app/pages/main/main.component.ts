import { adquiriente } from './../../interface/adquiriente';
import { NgForm } from '@angular/forms';
import { ApiRestService } from './../../service/api-rest.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AAA_DESTINO } from '../../interface/destino';
import { T_Vehiculo, VehiculoDTO } from 'src/app/interface/Vehiculos';
import * as XLSX from 'xlsx';
import { choferSec1 } from 'src/app/interface/chofer';
import { transportista } from 'src/app/interface/transportista';
import { destinatario } from 'src/app/interface/destinatario';
import { AAA_EMPRESA } from 'src/app/interface/Empresa';
import { origen } from 'src/app/interface/origen';
import { serie } from 'src/app/interface/serie';
import { chofer } from 'src/app/interface/choferSec';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent  {
  //carga excel
  @ViewChild('fileInput') fileInput!: ElementRef;
  transportista= {} as transportista;
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
  //destinatario
  destinatarioObject: adquiriente;
  //detalles guia pag
  pageProductGuia=1;
  //carga excel
  dataProductosExcel: any[];
  pageProductExcel=1;
  //doc relacionado
  tipoDocumentoDocRel='01';
  documentosReferenciados=[];
  tipoDocumentoEmisorDocRel='6';

  pais = 'PE';
  tipodocEmp = '6';
  ubigeoDestinoUpdate = '';
  direccionDestinoUpdate = '';
  codigolocalanexoUpdate = '';

  //arreglos
  destinos = [];
  origenes = [];
  guias=[];
  destinatarios=[];
  transportistas=[];
  empresas = [];
  choferes = [];
  motivos = [];
  //tablas
  tablaEmpresas = [];
  tablaOrigenes = [];
  tablaSeries:serie[] = [];
  arraySerie = [];

  // variable para formulario crud destinatario select tipo doc
  tipodocForm = '1';
  tipodocTrans = '6';
  tipodocChofer = '1';
  correlativo = 0;

  //filtro inputs
  filterTransportista='';
  filterOrigen='';
  filterDestinatario='';
  filterProducto='';
  filterDestino='';
  //-------------------------------------------------------------
  pageProduct = 0;
  vmotivo = '';
  vmodalidad = '02';
  fecha_emision = this.fechaActual();
  horaEmision = new Date(this.fecha_emision).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  fecha_traslado = this.fechaActual().substring(0, 10);

  modalidad = [{ id: '01', text: 'PUBLICO', }, { id: '02', text: 'PRIVADO' }];
  medidas = [{ id: 'KGM', text: 'KGM' }, { id: 'NIU', text: 'NIU' }]
  medida = 'KGM';
  medidaProductoCrud = 'KGM';

  modalRef: NgbModalRef;

  //producto modal -----------------------------------------
  selectedRow: number;
  objetoProducto: any = {};
  //destino modal-------------------------------------------
  ubigeoDestino = '';
  direccionDestino = '';
  codigolocalanexo = '';
  contador = 0;
  //producto modal------------------------------------------
  descripcion = '';

  productos = [];//todos los productos del modal
  listadoProductoDetalles = [];//todos los detalles de la guia de remision
  cantidad = '1';
  //datos adicionales chofer placas
  placaChofer = '';
  placaCarreta = '';
  modeloCarreta='';
  marcaVehiculo='';

  brevete = '';
  serieNumero = '';
  observaciones = '';

  pesoBruto = '';
  medidaGRE = 'KGM';

  Nrobultos = '';
  public VehiculosActivos:T_Vehiculo[]=[];
  public DestinoSeelct:AAA_DESTINO | undefined;
  public DestinoAUSar:AAA_DESTINO[] =[];
  constructor(public api: ApiRestService, private modalService: NgbModal, public rout: Router,private Serviceapi:ApiRestService) {
    this.obtenerInfo();
  }
  EditarDestinatario(modal, contenido) {
    this.destinatarioObject = contenido;
    this.abrirModal(modal);
  }
  obtenerInfo() {
    Swal.showLoading();
    this.api.getInfo().subscribe((res: any) => {
      Swal.close();
      this.empresas = res['empresas'];
      this.motivos = res['motivos'];
      this.choferes = res['chofer'];
      this.transportistas = res['transportista'];
      this.destinatarios = res['adquiriente'];
    });
    this.obtenerVehiculos();
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
  validarNumero(event: KeyboardEvent) {
    if (event.charCode !== 0) {
      const pattern = /[0-9]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (!pattern.test(inputChar)) {
        event.preventDefault();
      }
    }
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
  abrirModal(ModalTemplate) {
    this.modalRef = this.modalService.open(ModalTemplate, { size: 'lg' });
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
        this.obtenerInfo();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
  }
  updateAdquiriente(form: NgForm) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      form.value.DESTINO = this.destinatarioObject.destino;
      this.api.updateAdquiriente(form.value).subscribe((res: any) => {
        this.modalRef.close();
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.destinatarioObject.destino = [];
        this.obtenerInfo();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
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
        this.obtenerInfo();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
      })
    }
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
placavehiculo: valueform.PLACAVEHICULO,
tipodocumentochofer:valueform.TIPODOCUMENTOCHOFER
      } ;
      this.api.crearChofer(chofer).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.obtenerInfo();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
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
    this.destinatarioObject.destino.push(obj);
    this.ubigeoDestinoUpdate = '';
    this.direccionDestinoUpdate = '';
    this.codigolocalanexoUpdate = '';
    this.contador++;
  }
  asignarOrigen(origen:origen){
    this.origen=origen;
    this.modalRef.close();
  }
  borrarDestinoArray(id) {
    const indice = this.destinos.findIndex((elemento) => elemento.id === id);
    this.destinos.splice(indice, 1);
  }
  borrarDestinoArrayUpdate(id) {
    const indice = this.destinatarioObject.destino.findIndex((elemento) => elemento.id === id);
    this.destinatarioObject.destino.splice(indice, 1);
  }
  asignarDestinatario(destinatario:destinatario) {
    this.modalService.dismissAll();
    this.destinatario=destinatario;
    Swal.showLoading();
    this.api.getDestinosByRuc(destinatario.numerodocumentoadquiriente).subscribe((res:any)=>{
      this.destinos=res;
      Swal.close();
    },err=>{
      Swal.close();
    })
  }
  asignarChofer(chofer:chofer) {
    console.log(chofer)
    this.chofer=chofer;
    this.modalService.dismissAll();
    console.log(this.chofer)

  }
  asignarChoferSec(choferSec:chofer) {
    this.choferSec=choferSec;
    this.modalService.dismissAll();
  }

  asignarTransportista(transportista:transportista) {
    this.transportista=transportista;
    this.modalService.dismissAll();
  }
  salir() {
    this.destinos = []
    this.modalRef.close();
  }

  seleccionarProducto(codigo, descripcion, unidadmedida, row: number) {
    this.selectedRow = row;
    this.objetoProducto = { codigo: codigo, descripcion: descripcion, unidadmedida: unidadmedida }
  }
  asignarRemitente(remitente:AAA_EMPRESA){
    console.log(remitente)
    this.remitente=remitente;
    this.modalRef.close();
    this.api.getOrigenes(remitente.numerodocumentoemisor,0).subscribe((res: any) => {
      Swal.close();
      this.origen = res['ORIGEN'];
      this.arraySerie = res['SERIE'];
      this.serieNumero = '';
    }, error => {
      Swal.fire({ icon: 'error', title: 'Hubo un error en la conexión' });
    })
  }
  asignarProducto() {
    this.objetoProducto.cantidad = this.cantidad.toString();
    this.objetoProducto.descripcion = this.descripcion != '' ? this.objetoProducto.descripcion + ' ' + this.descripcion : this.objetoProducto.descripcion;
    var found = this.listadoProductoDetalles.find(object => object.codigo == this.objetoProducto.codigo && object.descripcion == this.objetoProducto.descripcion && object.unidadmedida == this.objetoProducto.unidadmedida);
    if (this.objetoProducto.codigo == null) {
      return Swal.fire({ icon: 'error', title: 'Seleccione un producto' });
    }
    if (found) {
      return Swal.fire({ icon: 'error', title: 'El producto ya ha sido insertado' });
    }
    this.listadoProductoDetalles.push(this.objetoProducto);
    this.salirProducto();
  }
  salirProducto() {
    this.objetoProducto = {};
    this.descripcion = '';
    this.cantidad = '1';
    this.selectedRow = null;
    this.modalService.dismissAll();
  }
  obtenerProductos(modal) {
    Swal.showLoading();
    this.api.getProductos().subscribe((res: any) => {
      Swal.close();
      this.productos = res;
      this.abrirModal(modal);

    }, error => {
      Swal.close();
      this.abrirModal(modal);
    });
  }
  borrarListadoProductoDetalles(codigo, descripcion, cantidad, unidadmedida) {
    const indice = this.listadoProductoDetalles.findIndex((elemento) => elemento.codigo == codigo && elemento.descripcion == descripcion && elemento.cantidad == cantidad && elemento.unidadmedida == unidadmedida);
    this.listadoProductoDetalles.splice(indice, 1);
  }
  declararGuia() {
    if (this.serieNumero == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'El campo serie y numero esta vacio!' });
    }
    if (this.serieNumero.length != 13) {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'El campo serie y numero debe tener un ancho de 13 letras!' });
    }
    if (this.remitente.razonsocialemisor == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione una empresa!' });
    }
    if (this.destino.direcciondestino == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un destino!' });
    }
    if (this.origen.direccionorigen == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un origen!' });
    }
    if (this.vmotivo == '') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un motivo!' });
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
    if (this.transportista.razonsocialtransportista == '' && this.vmodalidad == '01') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un transportista!' });
    }
    if (this.chofer.nombre == '' && this.vmodalidad == '02') {
      return Swal.fire({ icon: 'warning', title: 'Faltan Campos', text: 'Seleccione un chofer!' });
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
    this.api.declararGuia(obj).subscribe((res: any) => {
      Swal.fire({ icon: 'success', title: 'Se creó con éxito',text:res }).then(res => {
        window.location.reload();
      })
    }, err => {
      if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
      else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
    })
  }
  limpiarPantalla() {
  }
  llenarGuia() {
    if(this.vmodalidad=='01'){
      this.choferSec={} as chofer;
      this.chofer={} as chofer;
    }else{
      this.transportista={} as transportista;
    }
    var motivo=this.vmotivo.split("-");
    var obj = {
      tipoDocumentoRemitente: this.remitente.tipodocumentoemisor,
      numeroDocumentoRemitente: this.remitente.numerodocumentoemisor,
      serieNumeroGuia: this.serieNumero,
      fechaEmisionGuia: this.fecha_emision.substring(0, 10), //solo date yyyy-mm-dd
      observaciones: this.observaciones,
      razonSocialRemitente: this.remitente.razoncomercialemisor, //razonsocialemisor empresa
      correoRemitente: '-',
      correoDestinatario: this.destinatario.correo,
      numeroDocumentoDestinatario: this.destinatario.numerodocumentoadquiriente,
      tipoDocumentoDestinatario: this.destinatario.tipodocumentoadquiriente,
      razonSocialDestinatario: this.destinatario.razonsocialadquiriente,
      motivoTraslado: motivo[0],
      descripcionMotivoTraslado: motivo[1],
      indTransbordoProgramado: '',
      pesoBrutoTotalBienes: parseFloat(this.pesoBruto).toString(),
      unidadMedidaPesoBruto: this.medidaGRE,
      modalidadTraslado: this.vmodalidad, //01 publico 02 privado
      fechaInicioTraslado: this.fecha_traslado,
      numeroRucTransportista: this.transportista.numerodocumentotransportista,
      tipoDocumentoTransportista: this.transportista.tipodocumentotransportista,
      razonSocialTransportista: this.transportista.razonsocialtransportista,
      numeroDocumentoConductor: this.chofer.numerodocumentochofer == null ? '' : this.chofer.numerodocumentochofer,
      tipoDocumentoConductor: this.chofer.tipodocumentochofer == null ? '' : this.chofer.tipodocumentochofer,
      numeroPlacaVehiculoPrin: this.placaChofer, //conductor chofer
      numeroBultos: this.Nrobultos,
      ubigeoPtoLLegada: this.destino.ubigeodestino??"", //destino
      codigoPtollegada: this.destino.codigolocalanexo??"",
      codigoPtoPartida:  this.origen.codigolocalanexo??"",
      direccionPtoLLegada: this.destino.direcciondestino??"", //destino
      ubigeoPtoPartida: this.origen.ubigeoorigen??"", //origen
      direccionPtoPartida: this.origen.direccionorigen, //origen
      horaEmisionGuia: this.horaEmision, //solo hora!! hh:mm:ss
      fechaEntregaBienes: this.fecha_traslado, //fecha de entrega solo DATE
      numeroRegistroMTC: this.transportista.numeroregistromtc??"",//puede estar en blanco
      nombreConductor: this.chofer.nombre,
      apellidoConductor: this.chofer.apellido,
      numeroLicencia: this.chofer.brevete, //chofer
      spE_DESPATCH_ITEM: this.listadoProductoDetalles,
      SPE_DESPATCH_DOCRELACIONADO:this.documentosReferenciados,
      numeroDocumentoConductorSec1:this.choferSec.numerodocumentochofer,
      tipoDocumentoConductorSec1:this.choferSec.tipodocumentochofer,
      nombreConductorSec1:this.choferSec.nombre,
      apellidoConductorSec1 :this.choferSec.apellido,
      numeroLicenciaSec1:this.choferSec.brevete,
      textoAuxiliar250_1:this.placaCarreta,//placa carreta
      textoAuxiliar250_3:this.modeloCarreta,//modelo carreta,
      textoAuxiliar250_2:this.marcaVehiculo // modelo del vehiculo
    }
    return obj;
  }
  crearProducto(producto: NgForm) {
    if (producto.invalid) {
      return
    }
    if (producto.submitted) {
      Swal.showLoading();
      this.api.crearProducto(producto.value).subscribe((res: any) => {
        this.modalRef.close();
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.cargarProductos();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
      })
    }
  }
  cargarProductos() {
    this.api.getProductos().subscribe((res: any) => {
      if (res && res.length > 0) {
        this.productos = res;
      } else {
        this.productos = [];
      }
    }, error => {
      Swal.fire({ icon: 'error', title: 'Hubo un error en la conexión' });
    });
  }
  borrarProducto(id) {
    Swal.fire({
      title: 'Estás seguro?',
      text: 'El Producto con codigo ' + id + ' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.api.borrarProducto(id).subscribe((res: any) => {
          this.cargarProductos();
          Swal.fire({ icon: 'success', title: 'Se Eliminó con éxito' })
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error al crear el registro' }); }
        });
      }
    })

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
        this.obtenerInfo();
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
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
  listarOrigen(origen) {
    this.api.getOrigen().subscribe((res: any) => {
      this.abrirModal(origen);
      this.tablaOrigenes = res;
    });
  }
  crearOrigen(form) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      this.api.CrearOrigen(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.api.getOrigen().subscribe((res: any) => {
          this.tablaOrigenes = res;
        });
        this.remitente={} as AAA_EMPRESA;
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }

  }
  listarSerie(serie) {
    Swal.showLoading()
    this.api.getSerie().subscribe((res: any) => {
      Swal.close();
      this.abrirModal(serie);
      this.tablaSeries = res;
    });
  }
  crearSerie(form) {
    if (form.invalid) { return }
    if (form.submitted) {
      Swal.showLoading();
      form.value.SERIE = form.value.SERIE.toUpperCase();
      this.api.CrearSerie(form.value).subscribe((res: any) => {
        Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
        this.api.getSerie().subscribe((res: any) => {
          this.tablaSeries = res;
        });
        this.remitente={} as AAA_EMPRESA;
      }, err => {
        if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
        else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
      })
    }
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
          this.api.getSerie().subscribe((res: any) => {
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
      /* Read more about isConfirmed, isDenied below */
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
  borrarOrigen(ndoc, ubigeo, direccion) {
    Swal.showLoading();
    Swal.fire({
      icon:'warning',
      title: 'Estás seguro?',
      text: 'El Origen con el N° Doc ' + ndoc + ' y ubigeo '+ubigeo+' se eliminará',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor:'red',
      cancelButtonText: 'Salir'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var obj = { numerodocumentoemisor: ndoc, ubigeoorigen: ubigeo, direccionorigen: direccion }
        this.api.BorrarOrigen(obj).subscribe((res: any) => {
          this.api.getOrigen().subscribe((res: any) => {
            Swal.close();
            this.tablaOrigenes = res;

          });
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })

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
          this.api.getTransportista().subscribe((res: any) => {
            Swal.close();
            this.transportistas = res;
          });
          this.transportista={} as transportista;
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })
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
           this.obtenerInfo();
           this.chofer={} as chofer;
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })
  }
  validarDecimales(num:Number){
    const numString = num.toString();
    const match = numString.match(/\.(\d{4,})/);
    return match !== null && match[1].length > 3;
  }
  crearRef(ref: NgForm) {
    if (ref.valid) {
      const codigoDocumentoDocRel = ref.value.codigoDocumentoDocRel;
      const tipoDocumentoDocRel = ref.value.tipoDocumentoDocRel;
      const numeroDocumentoDocRel = ref.value.numeroDocumentoDocRel;
      const numeroDocumentoEmisorDocRel = ref.value.numeroDocumentoEmisorDocRel;
      const tipoDocumentoEmisorDocRel = ref.value.tipoDocumentoEmisorDocRel;

      if (!this.existeDocumentoReferenciado( tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel)) {
        // El elemento no existe, se agrega a la matriz
        this.documentosReferenciados.push(ref.value);
        this.salir();
      } else {
        // El elemento ya existe
        // Aquí puedes agregar el código que desees si el elemento ya existe
        Swal.fire({icon:'warning',title:'Ya existe el documento!',text:'El docuemnto con el codigo: '+codigoDocumentoDocRel+' ya existe'})
      }
    }
  }
  existeDocumentoReferenciado(tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel) {
    return this.documentosReferenciados.some((elemento) =>
      elemento.tipoDocumentoDocRel == tipoDocumentoDocRel &&
      elemento.numeroDocumentoDocRel == numeroDocumentoDocRel &&
      elemento.numerodocumentoemisorDocRel == numeroDocumentoEmisorDocRel &&
      elemento.tipoDocumentoEmisorDocRel == tipoDocumentoEmisorDocRel
    );
  }
  borrarRef( tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel) {
    const existe = this.existeDocumentoReferenciado(tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel);
    if (existe) {
      const indice = this.documentosReferenciados.findIndex((elemento) =>
        elemento.tipoDocumentoDocRel == tipoDocumentoDocRel &&
        elemento.numeroDocumentoDocRel == numeroDocumentoDocRel &&
        elemento.numeroDocumentoEmisorDocRel == numeroDocumentoEmisorDocRel &&
        elemento.tipoDocumentoEmisorDocRel == tipoDocumentoEmisorDocRel
      );
      this.documentosReferenciados.splice(indice, 1);
    }
  }
  obtenerVehiculos(){
    this.Serviceapi.getVehiculos().subscribe((resp:any)=>{
      this.VehiculosActivos=resp;
    })
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
        this.Serviceapi.BorrarVehiculos(idVehiculo).subscribe(resp=>{
          Swal.fire('Eliminado!', '', 'success')
          this.obtenerVehiculos();
        },error=>{
          Swal.fire('No se pudo eliminar el vehiculo', '', 'error')
        })
      }
    })
  }
  agregarVehiculo(ref: NgForm){
    let vehiculo:VehiculoDTO={
      color:ref.value.colorVehiculo,
      marca:ref.value.marcaVehiculo,
      modelo:ref.value.modeloVehiculo,
      placaVehiculo:ref.value.placaVehiculoVehiculo,
    };
    this.Serviceapi.AgregarVehiculo(vehiculo).subscribe((resp:any)=>{
      this.VehiculosActivos.push(resp);

      Swal.fire({ icon: 'success', title: 'Se creó con éxito' })
        this.modalRef.close();
    })
  }
  EditarUnVehiculo(vehiculo:T_Vehiculo){

  }
  asignarVehiculo(placa,marca){
    this.marcaVehiculo=marca;
    this.placaChofer=placa;
    this.modalRef.close();
  }
  asignarCarreta(placa,marca){
    this.placaCarreta=placa;
    this.modeloCarreta=marca;
    this.modalRef.close();
  }
  onFileChange(event: any, modal: any) {
    const file = event.target.files[0];
    // Validar la extensión del archivo
    const allowedExtensions = /(\.xls|\.xlsx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      Swal.fire({ icon: 'error', title: 'Error!', text: 'El archivo seleccionado no es un archivo de Excel válido. Por favor, seleccione un archivo con extensión .xls o .xlsx' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const lowerCaseData = jsonData.map((obj: any) => {
        const newObj: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            newObj[key.toLowerCase()] = obj[key];
          }
        }

        return newObj;
      });
      lowerCaseData.forEach(element => {
        if(element.peso!=null&&element.peso!=''){
          element.descripcion=element.descripcion+' '+element.peso;
        }
      });
      this.dataProductosExcel=lowerCaseData;
      this.modalRef = this.modalService.open(modal, { size: 'lg' });
      this.fileInput.nativeElement.value = '';
    };
    reader.readAsBinaryString(file);
  }
  salirExcel(){
    this.dataProductosExcel=[];
    this.modalRef.close();
  }
  asignarProductoExcel(){
    this.dataProductosExcel.forEach(element => {
      element.cantidad = String(element.cantidad);
      element.codigo = String(element.codigo);
      element.unidadmedida = String(element.unidadmedida);
      element.descripcion = String(element.descripcion);
    });
    this.listadoProductoDetalles=this.dataProductosExcel;
    this.dataProductosExcel=[];
    this.modalRef.close();

  }
  asignarDestino(destino:AAA_DESTINO){
    this.destino=destino;
    this.modalRef.close();
  }
}
