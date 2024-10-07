export class Usuarios {
    id!: number;
    nombre!: string;
    segundo_nombre?: string;
    apellido_paterno!: string;
    apellido_materno?: string;
    email!: string;
    contrasena!: string;
    nombre_empresa?: string;
    descripcion_corta?: string;
    foto_perfil?: string;
    estado_cuenta!: string;
    fecha_registro?: string;
    tipo_usuario_id!: number;
}
