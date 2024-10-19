import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataBaseService } from '../../services/data-base.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {
  compras: any[] = []; 
  usuario_id = 1; // Cambia esto según tu lógica para obtener el usuario_id

  constructor(private alertController: AlertController, private databaseService: DataBaseService) { }

  ngOnInit() {
    this.cargarCompras();
  }
  
  async cargarCompras() {
    this.compras = await this.databaseService.obtenerCompras(this.usuario_id);
  }

  async mostrarDetalles(carro_id: number) {
    const detalles = await this.databaseService.obtenerDetallesCompra(carro_id);
    
    let mensaje = 'Detalles de la Compra:\n';
    detalles.forEach(detalle => {
      mensaje += `Producto: ${detalle.nombre_producto}, Cantidad: ${detalle.cantidad}, Subtotal: $${detalle.subtotal.toFixed(2)}\n`;
    });

    const alert = await this.alertController.create({
      header: 'Detalles de la Compra',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}