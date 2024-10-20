import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    // Redirigir a la página de detalles del producto
    this.router.navigate([`/view-proventas`, { productoId }]);
  }

  modificarProducto(productoId: number) {
    // Redirigir a la página de modificación del producto
    this.router.navigate([`/mod-proventas`, { productoId }]);
  }

  agregarProducto() {
    this.router.navigate(['/add-proventas', { proveedorId: this.proveedorId }]);
  }

  async mostrarAlertaError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se pudo cargar los productos.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}