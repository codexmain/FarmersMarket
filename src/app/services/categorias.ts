// PARA SEPARAR CATEGORIAS(CAMBIAR DE SER NECESARIO, CONTINUA A PRODUCTOS.PAGE)
import { Injectable } from '@angular/core';
import { DataBaseService } from './data-base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  constructor(private dataBaseService: DataBaseService) {}

  getCategories(): Observable<Categorias[]> {
    return this.dataBaseService.getCategories();
  }
}
// PARA SEPARAR CATEGORIAS





export class Categorias {
    id!: number;
    nombre!: string;
}
