export class Productos {
    id!: number;
    proveedor_id!: number;
    nombre_producto!: string;
    descripcion_producto?: string;
    precio!: number;
    stock!: number;
    organico!: number;
    organicoEnTexto?: string;
    foto_producto?: string;
    subcategoria_id!: number;
    fecha_agregado?: string;
    nombre_subcategoria?: string;
    categoria_id?: number;
    nombre_proveedor?: string;
    nombre_categoria?: string;
}
