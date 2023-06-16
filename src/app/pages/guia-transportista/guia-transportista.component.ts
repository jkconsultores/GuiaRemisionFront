import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-guia-transportista',
  templateUrl: './guia-transportista.component.html',
  styleUrls: ['./guia-transportista.component.scss']
})
export class GuiaTransportistaComponent {
  fecha_emision = this.fechaActual();
  fecha_traslado = this.fechaActual().substring(0, 10);
  desde=this.fechaActual();
  hasta=this.fechaActual();
  pageGuia=0;
  pageProductGuia=0;
  filtroGuia='';
  cabecera={}
  pesoBruto = '';
  observaciones='';
  Nrobultos = '';
  arraySerie = [];
  destino = [];
  origen = [];
  guias=[];
  medidas = [{ id: 'KGM', text: 'KGM' }, { id: 'NIU', text: 'NIU' }]
  medida = 'KGM';
  modalRef: NgbModalRef;
  listadoProductoDetalles = [];//todos los detalles de la guia de remision


  //doc relacionado
  tipoDocumentoDocRel='01';
  documentosReferenciados=[];
  tipoDocumentoEmisorDocRel='6';

  constructor(private modalService: NgbModal){}
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
}
