import { Component, OnInit } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service'; // Ruta del servicio
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-regventas',
  templateUrl: './regventas.page.html',
  styleUrls: ['./regventas.page.scss'],
})
export class RegventasPage implements OnInit {
  compras: any[] = []; // Array para almacenar las compras del usuario

  constructor(
    private databaseService: DataBaseService,
    private nativeStorage: NativeStorage,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarCompras(); // Carga las compras al inicializar
  }

  async cargarCompras() {
    const email = await this.nativeStorage.getItem('userEmail'); // Obtén el correo del usuario
    this.databaseService.obtenerComprasPorEmail(email).then((compras) => {
      this.compras = compras; // Almacena las compras en el array
    }).catch((error) => {
      console.error('Error al cargar compras:', error);
    });
  }

  async mostrarDetalles(compraId: number) {
    // Obtiene los detalles de la compra
    const detalles = await this.databaseService.obtenerDetallesCompra(compraId);
    
    // Muestra los detalles en un alert
    const alert = await this.alertController.create({
      header: 'Detalles de la Compra',
      message: this.generarMensajeDetalles(detalles),
      buttons: ['OK']
    });
    await alert.present();
  }

  private generarMensajeDetalles(detalles: any[]): string {
    let mensaje = '';
    detalles.forEach(detalle => {
      mensaje += `Producto ID: ${detalle.producto_id} - Cantidad: ${detalle.cantidad} - Subtotal: $${detalle.subtotal}\n`;
    });
    return mensaje;
  }
}