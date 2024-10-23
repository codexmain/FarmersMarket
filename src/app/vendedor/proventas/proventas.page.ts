import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { AlertController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-proventas',
  templateUrl: './proventas.page.html',
  styleUrls: ['./proventas.page.scss'],
})
export class ProventasPage implements OnInit {
  productos: any[] = [];
  filtrados: any[] = [];
  searchTerm: string = '';
  proveedorId: number = 0;
  usuario: any;

  constructor(
    private router: Router,
    private db: DataBaseService,
    private alertController: AlertController,
    private nativeStorage: NativeStorage
  ) {}

  async ngOnInit() {
    await this.cargarDatosUsuario();
    await this.cargarProductos();
  }

  async ionViewWillEnter() {
    await this.cargarDatosUsuario();
    await this.cargarProductos();
  }

  private async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      const usuario = await this.db.getUserEmail(email);

      if (usuario) {
        this.usuario = usuario;
        this.proveedorId = usuario.id;
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.mostrarAlertaError();
    }
  }

  private async cargarProductos() {
    try {
      this.productos = await this.db.getProductosProveedor(this.proveedorId);
      console.log('Productos cargados:', this.productos);
      this.filtrados = this.productos.slice(1); // Omitimos el primer producto si es necesario
    } catch (error) {
      console.error('Error al cargar productos:', error);
      this.mostrarAlertaError();
    }
  }

  verDetalle(productoId: number) {
    this.router.navigate([`/view-proventas`, { productoId }]);
  }

  modificarProducto(productoId: number) {
    this.router.navigate([`/mod-proventas`, { productoId }]);
  }

  agregarProducto() {
    this.router.navigate(['/add-proventas', { proveedorId: this.proveedorId }]);
  }

  async confirmarEliminacion(productoId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de que desea eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarProducto(productoId);
          },
        },
      ],
    });
    await alert.present();
  }

  async eliminarProducto(productoId: number) {
    try {
      await this.db.eliminarPro(productoId);
      this.productos = this.productos.filter(producto => producto.id !== productoId);
      this.filtrados = this.filtrados.filter(producto => producto.id !== productoId); // Asegurar que se actualicen los filtrados también
      this.mostrarAlerta('Eliminar', 'Producto eliminado con éxito');
    } catch (error) {
      this.mostrarAlerta('Eliminar', 'Error al eliminar el producto: ' + error);
    }
  }

  searchItems() {
    if (this.searchTerm.trim() === '') {
      this.filtrados = this.productos;
    } else {
      const resultados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.filtrados = resultados.length > 0 ? resultados : [];
    }
  }

  private async mostrarAlertaError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se pudo cargar los productos.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}