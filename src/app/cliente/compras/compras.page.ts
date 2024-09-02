import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {

  productos = [
    {
      nombre: 'Producto 1',
      valor: '$10.00',
      descripcion: 'Descripción del producto 1',
      fecha: '29/08/2024',
      hora: '10:00 AM',
    },
    {
      nombre: 'Producto 2',
      valor: '$12.00',
      descripcion: 'Descripción del producto 2',
      fecha: '29/08/2024',
      hora: '11:30 AM',
    },
    {
      nombre: 'Producto 3',
      valor: '$24.00',
      descripcion: 'Descripción del producto 3',
      fecha: '29/08/2024',
      hora: '1:00 PM',
    },
    {
      nombre: 'Producto 4',
      valor: '$35.00',
      descripcion: 'Descripción del producto 4',
      fecha: '29/08/2024',
      hora: '3:30 PM',
    },
  ];

  constructor(private alertController: AlertController) { }

  ngOnInit() {
  }
  async mostrarResumen(producto: any) {
    const alert = await this.alertController.create({
      header: 'Resumen de Compra',
      message: `
        Nombre: ${producto.nombre}
        Valor: ${producto.valor}
        Descripción: ${producto.descripcion}
        Fecha: ${producto.fecha}
        Hora: ${producto.hora}
      `,
      buttons: ['OK'],
    });
  
    await alert.present();
  }
}
