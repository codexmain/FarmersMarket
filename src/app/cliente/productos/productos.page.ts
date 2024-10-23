import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos: any[] = []; // Array para almacenar productos
  filtrados: any[] = []; // Lista de productos filtrados
  searchTerm: string = ''; // Término de búsqueda
  usuario: any; // Variable para almacenar los datos del usuario


  constructor(
    private router: Router,
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage
  ) { }

  async ngOnInit() {
    await this.cargarDatosUsuario(); // Cargar datos del usuario
    await this.cargarProductos(); // Cargar productos
  }

  async ionViewWillEnter() {
    await this.cargarProductos();
    await this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail'); // Obtener email del almacenamiento local
      if (email) {
        // Obtener datos del usuario desde la base de datos
        this.usuario = await this.dbService.getUsuarioByEmail(email);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  async cargarProductos() {
    try {
      this.productos = await this.dbService.getAllProductos();
      console.log('Productos cargados:', this.productos); // Log para verificar los productos
      this.filtrados = this.productos.slice(1); // Omitir el primer producto
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  verDetalle(productoId: number) {
    this.router.navigate([`/pro-detalle`, productoId]); // Navegar a la página de detalles del producto
  }

  searchItems() {
    // Si el término de búsqueda está vacío, mostrar todos los productos
    if (this.searchTerm.trim() === '') {
      this.filtrados = this.productos.slice(1);
    } else {
      // Filtrar por nombre o descripción
      const resultados = this.productos.slice(1).filter(producto =>
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      // Si no se encuentran productos, establecer lista vacía
      this.filtrados = resultados.length > 0 ? resultados : [];

    }
  }
}