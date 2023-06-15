import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
}
