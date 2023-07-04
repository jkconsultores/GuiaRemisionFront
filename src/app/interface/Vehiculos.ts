export interface T_Vehiculo {
  id: number;
  usuarioId: number;
  placaVehiculo: string;
  fechaCreacion: string;
  modelo: string;
  color: string;
  marca: string;
}
export interface VehiculoDTO {
  placaVehiculo: string;
  modelo: string;
  color: string;
  marca: string;
  mtc:string;
}
