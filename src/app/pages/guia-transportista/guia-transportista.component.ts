import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { transportista } from '../../interface/transportista';
import { ApiRestService } from 'src/app/service/api-rest.service';
import { origen } from 'src/app/interface/origen';
import { chofer } from 'src/app/interface/chofer';
import { adquiriente } from 'src/app/interface/adquiriente';
import { destinatario } from 'src/app/interface/destinatario';
import { ApiTransportistaService } from 'src/app/service/api-transportista.service';
@Component({
  selector: 'app-guia-transportista',
  templateUrl: './guia-transportista.component.html',
  styleUrls: ['./guia-transportista.component.scss']
})
export class GuiaTransportistaComponent {
  transportista= {} as transportista;
  fecha_emision = this.fechaActual();
  fecha_traslado = this.fechaActual().substring(0, 10);
  desde=this.fechaActual();
  hasta=this.fechaActual();
  pageGuia=0;
  pageProductGuia=0;
  filtroGuia='';
  cabecera={}

  //filtro inputs
  filterTransportista='';
  filterOrigen='';
  filterDestinatario='';
  filterProducto='';
  //tablas
  tablaEmpresas = [];
  tablaOrigenes = [];
  tablaSeries = [];
  arraySerie = [];
  //arreglos
  destino = [];
  destinos = [];
  origenes = [];
  guias=[];
  destinatarios=[];
  transportistas=[];
  empresas = [];
  chofer = [];
  origen = [];
  // variable para formulario crud destinatario select tipo doc
  tipodocForm = '1';
  tipodocTrans = '6';
  tipodocChofer = '1';
  correlativo = 0;
    //destinatario
    destinatario={razonSocialDestinatario:''} as destinatario;
    //destino
    // destino={} destino
    //
  pais = 'PE';
  tipodocEmp = '6';
  empresa = '';
  //variables por defecto
  medidas = [{ id: 'KGM', text: 'KGM' }, { id: 'NIU', text: 'NIU' }]
  medida = 'KGM';
  modalRef: NgbModalRef;
  listadoProductoDetalles = [];//todos los detalles de la guia de remision


  //doc relacionado
  tipoDocumentoDocRel='01';
  documentosReferenciados=[];
  tipoDocumentoEmisorDocRel='6';

 choferSec={nombreConductorSec1:''} as chofer

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
  vorigen = '';
  constructor(private modalService: NgbModal,public api: ApiRestService,public apiT:ApiTransportistaService){
    this.obtenerInfo();
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
  crearRef(ref: NgForm) {
    if (ref.valid) {
      const codigoDocumentoDocRel = ref.value.codigoDocumentoDocRel;
      const tipoDocumentoDocRel = ref.value.tipoDocumentoDocRel;
      const numeroDocumentoDocRel = ref.value.numeroDocumentoDocRel;
      const numeroDocumentoEmisorDocRel = ref.value.numeroDocumentoEmisorDocRel;
      const tipoDocumentoEmisorDocRel = ref.value.tipoDocumentoEmisorDocRel;
      if (!this.existeDocumentoReferenciado(codigoDocumentoDocRel, tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel)) {
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
  salir() {
    this.modalRef.close();
  }
  existeDocumentoReferenciado(codigoDocumentoDocRel, tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel) {
    return this.documentosReferenciados.some((elemento) =>
      elemento.codigoDocumentoDocRel == codigoDocumentoDocRel &&
      elemento.tipoDocumentoDocRel == tipoDocumentoDocRel &&
      elemento.numeroDocumentoDocRel == numeroDocumentoDocRel &&
      elemento.numeroDocumentoEmisorDocRel == numeroDocumentoEmisorDocRel &&
      elemento.tipoDocumentoEmisorDocRel == tipoDocumentoEmisorDocRel
    );
  }
  borrarRef(codigoDocumentoDocRel, tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel) {
    const existe = this.existeDocumentoReferenciado(codigoDocumentoDocRel, tipoDocumentoDocRel, numeroDocumentoDocRel, numeroDocumentoEmisorDocRel, tipoDocumentoEmisorDocRel);
    if (existe) {
      const indice = this.documentosReferenciados.findIndex((elemento) =>
        elemento.codigoDocumentoDocRel == codigoDocumentoDocRel &&
        elemento.tipoDocumentoDocRel == tipoDocumentoDocRel &&
        elemento.numeroDocumentoDocRel == numeroDocumentoDocRel &&
        elemento.numeroDocumentoEmisorDocRel == numeroDocumentoEmisorDocRel &&
        elemento.tipoDocumentoEmisorDocRel == tipoDocumentoEmisorDocRel
      );
      this.documentosReferenciados.splice(indice, 1);
    }
  }
  borrarListadoProductoDetalles(codigo, descripcion, cantidad, unidadmedida) {
    const indice = this.listadoProductoDetalles.findIndex((elemento) => elemento.codigo == codigo && elemento.descripcion == descripcion && elemento.cantidad == cantidad && elemento.unidadmedida == unidadmedida);
    this.listadoProductoDetalles.splice(indice, 1);
  }
  asignarTransportista(transportista:transportista) {
     this.transportista=transportista;
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
          this.api.getTransportista().subscribe((res: any) => {
            Swal.close();
            this.transportistas = res;
          });
          this.limpiarTransportista();
        }, err => {
          if (err.error.detail) { Swal.fire({ icon: 'warning', text: err.error.detail }); }
          else { Swal.fire({ icon: 'warning', text: 'Hubo un error en la conexión' }); }
        })
      }
    })
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
        this.obtenerInfo();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
      })
    }
  }
  obtenerInfo() {
    Swal.showLoading();
    this.api.getInfo().subscribe((res: any) => {
      Swal.close();
      this.transportistas = res['transportista'];
    });
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
        this.obtenerInfo();
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
  empresaChange(id: string) {
    if (id) {
      Swal.showLoading();
      var num = id.split('-');
      const partes = id.split("-");
      const ruc = partes.shift();
      this.empresaid = id;
      this.api.getOrigenes(ruc, num[3]).subscribe((res: any) => {
        Swal.close();
        this.origen = res['ORIGEN'];
        this.arraySerie = res['SERIE'];
        this.serieNumero = '';
        this.vorigen = '';
      }, error => {
        Swal.fire({ icon: 'error', title: 'Hubo un error en la conexión' });
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
        this.empresa = '';
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
        this.obtenerInfo();
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
    this.destinatarioObject.destino.push(obj);
    this.ubigeoDestinoUpdate = '';
    this.direccionDestinoUpdate = '';
    this.codigolocalanexoUpdate = '';
    this.contador++;
  }
  asignarDestinatario(nombre, ndoc, correo, tipoDoc) {
    var nuevoDestinatario={ razonSocialDestinatario:''} as destinatario
    this.destinatario.razonSocialDestinatario = nuevoDestinatario.razonSocialDestinatario;
    this.destinatario.correoDestinatario = correo;
    this.destinatario.numeroDocumentoDestinatario = ndoc;
    this.destinatario.tipoDocumentoDestinatario = tipoDoc;
    this.modalService.dismissAll();
    Swal.showLoading();
    var getDestinosForm={
      numerodocumentoadquiriente:ndoc,
      datestamp:new Date(),
      direcciondestino:null,
      usuarioid:0,
      ubigeodestino:null,
      codigolocalanexo:""
    };

    this.api.getDestinos(getDestinosForm).subscribe((res: any) => {
      this.destino = res;
      Swal.close();
    });
  }
  EditarDestinatario(modal, contenido) {
    this.destinatarioObject = contenido;
    this.abrirModal(modal);
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
  borrarDestinoArray(id) {
    const indice = this.destinos.findIndex((elemento) => elemento.id === id);
    this.destinos.splice(indice, 1);
  }
  borrarDestinoArrayUpdate(id) {
    const indice = this.destinatarioObject.destino.findIndex((elemento) => elemento.id === id);
    this.destinatarioObject.destino.splice(indice, 1);
  }
  listarSerie(serie) {
    Swal.showLoading()
    this.api.getSerie().subscribe((res: any) => {
      Swal.close();
      this.abrirModal(serie);
      this.tablaSeries = res;
    });
  }
}
