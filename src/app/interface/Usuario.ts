export interface USUARIO {
  usuarioid: number;
  nombreusuario: string;
  contrasena: string;
  nombres: string | null;
  correoelectronico: string | null;
  estado:boolean;
  rol: boolean;
}
export interface UsuariosDTO {
  nombreusuario: string;
  contrasena: string;
  nombres: string | null;
  correoelectronico: string | null;
  rol: boolean;

}
