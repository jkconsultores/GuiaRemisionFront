import { ApiRestService } from './../../service/api-rest.service';
import { Component } from '@angular/core';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent {
  filterSerie='';
  filtroEstado='';
  page=0;
  spe_despatch = [];
  spe_despatch_item = [];
  desde = this.fechaActual();
  hasta = this.fechaActual();
  modalRef: NgbModalRef;
  constructor(private api: ApiRestService, private modalService: NgbModal) {
    this.getSpe_despatch(this.desde,this.hasta);
  }
  getSpe_despatch(desde,hasta) {
    Swal.showLoading();
    this.api.getSpe_despatch(desde,hasta).subscribe((res: any) => {
      console.log(res.result)
      Swal.close();
      this.spe_despatch = res.result;
    });
  }
  abrirModal(modal, serie) {
    Swal.showLoading();
    this.api.getSpe_despatch_item(serie).subscribe((res: any) => {
      this.spe_despatch_item = res;
      Swal.close();
      this.modalRef = this.modalService.open(modal, { size: 'lg' });
    }, error => {
      Swal.fire({ icon: 'error', title: 'Hubo un error en crear el registro' })
    })
  }
  fechaActual() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  buscarReporteRango(){
    this.page=0;
    this.getSpe_despatch(this.desde,this.hasta);
  }
  llenarFiltro(valor: any) {
    var r = document.getElementById(valor) as HTMLInputElement | null;
    this.filtroEstado = r.value;
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.spe_despatch);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'spe_despatch.xlsx');
  }
  descargarPdf(url: string,nombre:string) {
    window.open(url,'_blank');
    // this.api.ObtenerPDFDeFactura(url).subscribe((resp: any) => this.downLoadFile(resp, "application/pdf", nombre))
  }
  downLoadFile(data: any, type: string, nombre: string) {
    const file = new File([data], nombre, { type: type });
    saveAs(file);
  }
}
