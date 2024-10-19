export class Usuarios {
    id!: number;
    nombre!: string;
    segundo_nombre?: string;
    apellido_paterno!: string;
    apellido_materno?: string;
    nombreCompleto!: string;
    email!: string;
    contrasena!: string;
    nombre_empresa?: string;
    empresaMostrarListar?: string; //este es para el caso de desplegar la info general
    descripcion_corta?: string;
    descripcionMostrarListar?: string; //este caso el caso de desplegar la info general
    foto_perfil?: string;
    estado_cuenta!: string;
    fecha_registro?: string;
    tipo_usuario_id!: number;
    descTipUser?: string;
}
