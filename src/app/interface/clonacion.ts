export interface clonacion{
  cabecera:cabecera,
  cuerpo:cuerpo[],
  relacionado:relacionado[]
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
