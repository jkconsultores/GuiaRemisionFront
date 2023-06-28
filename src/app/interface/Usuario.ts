export interface USUARIO {
  usuarioid: number;
  nombreusuario: string;
  contrasena: string;
  nombres: string | null;
  correoelectronico: string | null;
  estado:boolean;
}
export interface UsuariosDTO {
  nombreusuario: string;
  contrasena: string;
  nombres: string | null;
  correoelectronico: string | null;
}
