import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service'; // Verifica la ruta correcta
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';  // Importar Router para redirigir

@Component({
  selector: 'app-proventas',
  templateUrl: './proventas.page.html',
  styleUrls: ['./proventas.page.scss'],
})
export class ProventasPage implements OnInit {

  productos: any[] = [];  // Usando `any` en lugar de una interfaz
  searchQuery: string = '';  // Para la barra de búsqueda

  constructor(
    private databaseService: DataBaseService,
    private nativeStorage: NativeStorage,
    private alertController: AlertController,
    private router: Router  // Inyectar Router
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  async cargarProductos() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');  // Obtener el email del almacenamiento
      const productos = await this.databaseService.mostrarProductos(email);
      this.productos = productos;
    } catch (error) {
      console.error('Error al cargar productos', error);
    }
  }

  async mostrarAlertaModificar(producto: any) {
    const alert = await this.alertController.create({
      header: 'Modificar Producto',
      message: `Modificar producto: ${producto.nombre_producto}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Modificar',
          handler: () => {
            // Redirigir a la página de modificar producto con el id
            this.router.navigate([`pro-mod`, producto.id]);
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarAlertaAgregar() {
    const alert = await this.alertController.create({
      header: 'Agregar Producto',
      message: `Agregar un nuevo producto`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: () => {
            // Redirigir a la página de agregar producto
            this.router.navigate([`pro-add`]);
          }
        }
      ]
    });

    await alert.present();
  }

  // Filtro simple para la barra de búsqueda
  getProductosFiltrados() {
    return this.productos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}