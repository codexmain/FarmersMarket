import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service'; 
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carro: any; // Para almacenar el carro de compras
  detalles: any[] = []; // Para almacenar los detalles de los productos en el carro
  usuarioId: number=0; // Almacena el ID del usuario
  totalCompra: number = 0; // Para almacenar el total de la compra

  constructor(
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.obtenerUsuarioId();
    await this.cargarCarrito();
  }

  async obtenerUsuarioId() {
    const email = await this.nativeStorage.getItem('userEmail');
    const usuario = await this.dbService.getUsuarioEmail(email);
    if (usuario) {
      this.usuarioId = usuario.id; // Asignar el ID del usuario
    } else {
      console.error('Usuario no encontrado');
    }
  }

  async cargarCarrito() {
    // Obtener el carro de compras del usuario
    this.carro = await this.dbService.getCarroCompra(this.usuarioId);
    if (this.carro) {
      this.detalles = await this.dbService.getDetallesCarro(this.carro.id);
      this.calcularTotal();
    } else {
      console.log('No hay productos en el carrito.');
    }
  }

  calcularTotal() {
    this.totalCompra = this.detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
  }

  async eliminarProducto(detalleId: number) {
    await this.dbService.eliminarProductoDelCarro(detalleId);
    this.detalles = this.detalles.filter(detalle => detalle.id !== detalleId);
    this.calcularTotal();
    this.presentAlert('Producto eliminado', 'El producto ha sido eliminado del carrito.');
  }

  async confirmarCompra() {
    if (this.detalles.length === 0) {
      this.presentAlert('Carrito vacío', 'No hay productos en el carrito para confirmar la compra.');
      return;
    }

    const confirm = await this.presentConfirmationAlert();

    if (confirm) {
      await this.dbService.confirmarCompra(this.carro.id);
      await Promise.all(this.detalles.map(detalle => this.reducirStock(detalle.producto_id, detalle.cantidad)));
      this.presentAlert('Compra confirmada', 'Su compra ha sido confirmada.');
      this.detalles = []; // Limpiar el carrito
      this.totalCompra = 0; // Reiniciar el total
    }
  }

  async reducirStock(productoId: number, cantidad: number) {
    await this.dbService.reducirStock(productoId, cantidad);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmar Compra',
      message: '¿Está seguro de que desea confirmar la compra?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            return true;
          }
        }
      ]
    });
    await alert.present();

    const result = await alert.onDidDismiss();
    return result.role !== 'cancel'; // Devuelve true si el usuario confirma
  }
}