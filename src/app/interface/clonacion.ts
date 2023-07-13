export interface clonacion{
  cabecera:cabecera,
  cuerpo:cuerpo[],
  relacionados:relacionado[],
  camposExtra:camposExtra[]
}

export interface cabecera{
    tipoDocumentoRemitente: string,
    numeroDocumentoRemitente: string,
    serieNumeroGuia: string,
    tipoDocumentoGuia: string,
    observaciones: string,
    razonSocialRemitente: string,
    correoRemitente: string,
    correoDestinatario: string,
    numeroDocumentoRelacionado: string,
    codigoDocumentoRelacionado: null,
    numeroDocumentoDestinatario: string,
    tipoDocumentoDestinatario: string,
    razonSocialDestinatario: string,
    pesoBrutoTotalBienes: string,
    unidadMedidaPesoBruto: string,
    fechaInicioTraslado: string,
    fechaEmisionGuia:string,
    numeroRucTransportista: string,
    tipoDocumentoTransportista: string,
    razonSocialTransportista: string,
    numeroDocumentoConductor: string,
    tipoDocumentoConductor: string,
    numeroPlacaVehiculoPrin: string,
    numeroBultos: string,
    ubigeoPtoLLegada: string,
    direccionPtoLLegada: string,
    ubigeoPtoPartida: string,
    direccionPtoPartida: string,
    nombreConductor: string,
    apellidoConductor: string,
    numeroLicencia: string,
    numeroDocumentoConductorSec1:string,
    tipoDocumentoConductorSec1:string,
    nombreConductorSec1:string,
    apellidoConductorSec1:string,
    numeroLicenciaSec1:string,
    razonSocialSubcontratista:string,
    numeroDocSubcontratista:string,
    tipoDocumentoSubcontratista:string
}
export interface cuerpo{
        tipoDocumentoRemision: string,
        numeroDocumentoRemision: string,
        serieNumeroGuia: string,
        tipoDocumentoGuia: string,
        numeroOrdenItem: string,
        cantidad: string,
        unidadMedida: string,
        descripcion: string,
        codigo: string,
        codigoProductoSUNAT: string,
    }
  export interface relacionado
      {
          numeroDocumentoRemitente: string,
          tipoDocumentoGuia: string,
          tipoDocumentoRemitente: string,
          serieNumeroGuia: string,
          ordenDocRel: string,
          tipoDocumentoDocRel: string,
          codigoDocumentoDocRel: string,
          numeroDocumentoDocRel:string,
          numeroDocumentoEmisorDocRel: string,
          tipoDocumentoEmisorDocRel:string
  }
  export interface camposExtra{
      tipo: string,
      almacen: string,
      referencia: string,
      servicio: string,
      ticket: string
  }
