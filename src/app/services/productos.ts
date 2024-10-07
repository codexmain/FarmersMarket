export class Productos {
    id!: number;
    proveedor_id!: number;
    nombre!: string;
    descripcion?: string;
    precio!: number;
    stock!: number;
    organico!: number;
    foto_producto?: string;
    subcategoria_id!: number;
    fecha_agregado?: string;
}
