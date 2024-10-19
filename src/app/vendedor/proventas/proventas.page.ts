import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-proventas',
  templateUrl: './proventas.page.html',
  styleUrls: ['./proventas.page.scss'],
})
export class ProventasPage implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  private searchSubject = new Subject<string>(); // Subject para la búsqueda

  constructor(
    private alertController: AlertController,
    private databaseService: DataBaseService,
    private nativeStorage: NativeStorage,
    private router: Router
  ) {}

  ngOnInit() {
    this.mostrarProductos();
    this.setupSearchListener(); // Configurar el listener para la búsqueda
  }

  // Configurar el listener para la búsqueda
  private setupSearchListener() {
    this.searchSubject
      .pipe(debounceTime(300)) // Espera 300ms después de la última pulsación
      .subscribe((texto) => this.filtrarProductos(texto));
  }

  // Mostrar productos
  async mostrarProductos() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      this.productos = await this.databaseService.mostrarProductos(email);
      this.productosFiltrados = [...this.productos]; // Inicializamos productos filtrados
    } catch (error) {
      console.error('Error al cargar los productos:', error);
      await this.presentAlert(
        'Error',
        'No se pudo cargar la lista de productos.'
      );
    }
  }

  // Buscar producto en tiempo real
  buscarProducto(event: any) {
    const texto = event.target.value.toLowerCase();
    this.searchSubject.next(texto); // Emitir el valor a buscar
  }

  // Filtrar productos según el texto buscado
  private filtrarProductos(texto: string) {
    if (texto && texto.trim() !== '') {
      this.productosFiltrados = this.productos.filter((producto) =>
        producto.titulo.toLowerCase().includes(texto)
      );
    } else {
      this.productosFiltrados = [...this.productos]; // Mostrar todos los productos si no hay texto
    }
  }

  // Eliminar producto
  async eliminarProducto(producto: any) {
    try {
      await this.databaseService.eliminarProducto(
        producto.id,
        producto.proveedor_id,
        producto.nombre_producto,
        producto.descripcion_producto,
        producto.precio,
        producto.stock,
        producto.organico,
        producto.foto_producto,
        producto.subcategoria_id
      );
      await this.presentAlert('Éxito', 'Producto eliminado con éxito.');
      this.mostrarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      await this.presentAlert('Error', 'No se pudo eliminar el producto.');
    }
  }

  // Función para mostrar alerta al agregar un producto
  async presentAgregarProductoAlert() {
    const alert = await this.alertController.create({
      header: 'Agregar Producto',
      message: '¿Desea agregar un nuevo producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Agregar',
          handler: () => {
            // Redirigir a la página de agregar producto sin parámetros adicionales
            this.router.navigate(['/pro-add']);
          },
        },
      ],
    });

    await alert.present();
  }

  // Función para mostrar alerta al modificar un producto
  async presentModificarProductoAlert(producto: any) {
    const alert = await this.alertController.create({
      header: 'Modificar Producto',
      message: `¿Desea modificar el producto: ${producto.titulo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Modificar',
          handler: () => {
            // Redirigir a la página de modificar producto pasando el objeto completo
            this.router.navigate(['/pro-mod'], { state: { producto } });
          },
        },
      ],
    });

    await alert.present();
  }

  // Mostrar alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
