

//RANDOM PRODUCTOS Y MAPEADO (CAMBIAR DE SER NECESARIO, AFECTA A PRODUCTOS.PAGE)

import { Injectable } from '@angular/core';
import { DataBaseService } from './data-base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor(private dataBaseService: DataBaseService) {}
//RANDOM POR REGION (CAMBIAR POR GPS)
  getRandomProducts(regionId: number): Observable<Productos[]> {
    return this.dataBaseService.getRandomProductsByRegion(regionId).pipe(
      map(productos => this.shuffleArray(productos))
    );
  }


  private shuffleArray(array: Productos[]): Productos[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
//RANDOM PRODUCTOS







export class Productos {
    id!: number;
    proveedor_id!: number;
    nombre_producto!: string;
    descripcion_producto?: string;
    precio!: number;
    stock!: number;
    organico!: number;
    foto_producto?: string;
    subcategoria_id!: number;
    fecha_agregado?: string;
}
