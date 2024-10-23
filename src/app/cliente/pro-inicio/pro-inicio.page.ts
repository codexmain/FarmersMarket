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
  filtrados: any[] = []; // Lista de productos filtrados
  searchTerm: string = ''; // Término de búsqueda

  constructor(private route: ActivatedRoute, private router: Router, private db: DataBaseService) {}

  async ngOnInit() {
    this.cargarProductosDelProveedor();
  }

  async ionViewWillEnter() {
    await this.cargarProductosDelProveedor();
  }

  // Función separada para cargar los productos del proveedor
  private async cargarProductosDelProveedor() {
    try {
      // Obtener el ID del proveedor desde la ruta
      this.proveedorId = Number(this.route.snapshot.paramMap.get('id'));

      if (this.proveedorId) {
        // Obtener los productos del proveedor
        this.productos = await this.db.getProductosPorProveedor(this.proveedorId);
        console.log('Productos cargados:', this.productos); // Log de control

        // Inicializar la lista de filtrados con todos los productos al inicio
        this.filtrados = [...this.productos];
      } else {
        console.error('ID de proveedor no encontrado.');
      }
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }
  


  verDetalle(productoId: number) {
    this.router.navigate([`/pro-detalle`, productoId]);
  }

  searchItems() {
    // Si el término de búsqueda está vacío, mostrar todos los productos
    if (this.searchTerm.trim() === '') {
      this.filtrados = this.productos;
    } else {
      // Filtrar por nombre o descripción
      const resultados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      // Si no se encuentran productos, establecer lista vacía
      this.filtrados = resultados.length > 0 ? resultados : [];

    }
  }
}