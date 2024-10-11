
//PARA SEPARAR POR SUBCategorIAS (CAMBIAR DE SER NECESARIO, CONTINUA EN PRODUCTO.PAGE)
import { Injectable } from '@angular/core';
import { DataBaseService } from './data-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriasService {
  constructor(private dataBaseService: DataBaseService) {}

  getSubcategories(categoryId: number): Observable<Subcategorias[]> {
    return this.dataBaseService.getSubcategories(categoryId);
  }
}
//PARA SEPARAR POR SUBCategorIAS






export class Subcategorias {
    id!: number;
    nombre!: string;
    categoria_id!: number;
}
