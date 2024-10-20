import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-view-proventas',
  templateUrl: './view-proventas.page.html',
  styleUrls: ['./view-proventas.page.scss'],
})
export class ViewProventasPage implements OnInit {
  productoId: number = 0;
  producto: any = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    organico: 0
  };

  constructor(
    private route: ActivatedRoute,
    private db: DataBaseService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productoId = params['productoId'];
      this.obtenerProducto(this.productoId);
    });
  }

  async obtenerProducto(productoId: number) {
    try {
      this.producto = await this.db.obtenerProducto(productoId); // Método para obtener producto por ID
      if (!this.producto) {
        this.mostrarAlertaError('Producto no encontrado.');
      }
    } catch (error) {
      console.error('Error al obtener el producto', error);
      this.mostrarAlertaError();
    }
  }

  async mostrarAlertaError(mensaje: string = 'No se pudo cargar el producto.') {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}