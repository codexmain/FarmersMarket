import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';

@Component({
  selector: 'app-pro-inicio',
  templateUrl: './pro-inicio.page.html',
  styleUrls: ['./pro-inicio.page.scss'],
})
export class ProInicioPage implements OnInit {
  productos: any[] = [];
  proveedorId: number=0;

  constructor(private route: ActivatedRoute, private router: Router, private db: DataBaseService) {}

  async ngOnInit() {
    // Obtener el ID del proveedor desde la ruta
    this.proveedorId = Number(this.route.snapshot.paramMap.get('id'));

    // Obtener productos del proveedor
    this.productos = await this.db.getProductosPorProveedor(this.proveedorId);
  }

  verDetalle(productoId: number) {
    this.router.navigate([`/pro-detalle`, productoId]);
  }
}