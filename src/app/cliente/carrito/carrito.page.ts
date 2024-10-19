import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataBaseService } from '../../services/data-base.service'; 

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  productosCarro: any[] = []; 
  carro_id = 1; // Cambia esto según tu lógica para obtener el carro_id
  usuario_id = 1; // Cambia esto según la lógica para obtener el usuario_id

  constructor(private alertController: AlertController, private databaseService: DataBaseService) {}

  ngOnInit() {
    this.cargarProductosDelCarro();
  }

  async cargarProductosDelCarro() {
    this.productosCarro = await this.databaseService.obtenerProductosDelCarro(this.carro_id);
  }

  async eliminarProducto(producto: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar ${producto.producto_id} del carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.databaseService.eliminarProductoDelCarro(this.carro_id, producto.producto_id);
            this.cargarProductosDelCarro(); 
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para confirmar la compra
  async confirmarCompra() {
    const alert = await this.alertController.create({
      header: 'Confirmar Compra',
      message: '¿Estás seguro de que deseas confirmar tu compra?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            await this.databaseService.confirmarCompra(this.carro_id, this.usuario_id);
            this.productosCarro = []; // Limpia el carrito
            // Muestra un mensaje de éxito o redirige a otra página
            const successAlert = await this.alertController.create({
              header: 'Compra Confirmada',
              message: 'Tu compra ha sido confirmada con éxito.',
              buttons: ['OK'],
            });
            await successAlert.present();
          },
        },
      ],
    });

    await alert.present();
  }
}