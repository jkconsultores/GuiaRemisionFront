import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MOTIVOS } from 'src/app/interface/Motivos';
import { AAA_TIPODOCUMENTO } from 'src/app/interface/aaa_TipoDocumento';
import { ApiRestService } from 'src/app/service/api-rest.service';

@Component({
  selector: 'app-registro-de-usuarios-component',
  templateUrl: './registro-de-usuarios-component.component.html',
  styleUrls: ['./registro-de-usuarios-component.component.scss']
})
export class RegistroDeUsuariosComponentComponent implements OnInit {
  modalRef: NgbModalRef;
  arraySerie:AAA_TIPODOCUMENTO[] = [];
  arrayMotivo:MOTIVOS[]=[];
  serieNumero = '';
  motivo = '';
  constructor(private modalService: NgbModal,private api:ApiRestService){}
  ngOnInit(): void {
    this.api.getSeries().subscribe((resp:any)=>{
      this.arraySerie=resp
    },error=>{

    });
    this.api.getMotivos().subscribe((resp:any)=>{
      this.arrayMotivo=resp;
    })
  }
  abrirModal(ModalTemplate) {
    this.modalRef = this.modalService.open(ModalTemplate, { size: 'lg' });
  }
  salir() {
    this.modalRef.close();
  }
  AgregarUsuario(ref: NgForm){

  }
}
