export class Amonestaciones {
    id!: number;
    usuario_id!: number;
    nombre_usuario!: string;
    nombre_empresa?: string;
    id_producto?: any;
    nombre_producto?: any; //se dejo como any ya que puede haber uno sin producto
    descripcion!: string;

}
