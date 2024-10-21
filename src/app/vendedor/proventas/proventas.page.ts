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
  proveedorId: number = 0;

  constructor(
    private router: Router,
    private db: DataBaseService,
    private alertController: AlertController,
    private nativeStorage: NativeStorage
  ) {}

  async ngOnInit() {
    await this.cargarDatosUsuario();
  }

  async ionViewWillEnter() {
    await this.cargarDatosUsuario();
  }

  private async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      const usuario = await this.db.getUserEmail(email);

      if (usuario) {
        this.proveedorId = usuario.id;
        this.productos = await this.db.getProductosProveedor(this.proveedorId);
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
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
      await this.db.eliminarPro(productoId);  // Llama al método del servicio para eliminar el producto
      this.productos = this.productos.filter(producto => producto.id !== productoId);  // Filtra el producto eliminado
      this.mostrarAlerta('Eliminar', 'Producto eliminado con éxito');
    } catch (error) {
      this.mostrarAlerta('Eliminar', 'Error al eliminar el producto: ' + error);
    }
  }

  async mostrarAlertaError() {
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