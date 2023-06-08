import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-reporte-transportista',
  templateUrl: './reporte-transportista.component.html',
  styleUrls: ['./reporte-transportista.component.scss']
})
export class ReporteTransportistaComponent {
  page=0;
  filterSerie='';
  constructor(){

  }

  data: any[];

  onFileChange(event: any) {
    const file = event.target.files[0];

    // Validar la extensión del archivo
    const allowedExtensions = /(\.xls|\.xlsx)$/i;
    if (!allowedExtensions.exec(file.name)) {
      Swal.fire({icon:'error',title:'Error!',text:'El archivo seleccionado no es un archivo de Excel válido. Por favor, seleccione un archivo con extensión .xls o .xlsx'})
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      this.data = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      this.data.shift();
    };
    reader.readAsBinaryString(file);
  }


}
