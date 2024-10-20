import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service'; 

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: any[] = [];

  constructor(private router: Router, private dbService: DataBaseService) {}

  async ngOnInit() {
    this.productos = await this.dbService.getAllProductos();
  }

  verDetalle(productoId: number) {
    this.router.navigate([`/pro-detalle`, productoId]);
  }
}