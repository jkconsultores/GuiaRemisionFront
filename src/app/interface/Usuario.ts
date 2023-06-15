export interface USUARIO {
  usuarioid: number;
  nombreusuario: string;
  contrasena: string;
  nombres: string | null;
  correoelectronico: string | null;
}
export interface UsuariosDTO {
  nombreusuario: string;
  contrasena: string;
  nombres: string | null;
  correoelectronico: string | null;
}
