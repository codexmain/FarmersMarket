import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }

  async confirmarCompra() {
    const alert = await this.alertController.create({
      header: 'Compra exitosa',
      message: 'Tu compra ha sido realizada con éxito.(pendiente el metodo de pago)',
      buttons: ['OK']
    });

    await alert.present();
  }

}
