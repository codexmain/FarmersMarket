import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Productos } from '../services/productos';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss'],
})
export class DetalleProductoComponent  implements OnInit {
  @Input() producto!: Productos;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}
  
  closeModal() {
    this.modalController.dismiss();
  }

}
