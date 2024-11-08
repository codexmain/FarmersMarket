import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AmonestacionesssService } from '../../services/amonestacionesss.service';

@Component({
  selector: 'app-hacer-amonestacion',
  templateUrl: './hacer-amonestacion.page.html',
  styleUrls: ['./hacer-amonestacion.page.scss'],
})
export class HacerAmonestacionPage implements OnInit {
  productos: any[] = [];

  constructor(
    private modalController: ModalController,
    private amonestacionesssService: AmonestacionesssService
  ) { }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.amonestacionesssService.fetchCmbProdAmnstones().subscribe((data) => {
      this.productos = data;
    });
  }

  enviarAmonestacion(form: NgForm) {
    if (form.valid) {
      const { correo, descripcion, idProducto } = form.value;
      this.amonestacionesssService.enviarAmonestacion(correo, descripcion, idProducto)
        .then(() => {
          console.log('Amonestación enviada');
          this.dismissModal(true); // Cierra el modal con éxito
          form.reset(); // Reinicia el formulario
        })
        .catch((error) => {
          console.error('Error al enviar amonestación:', error);
        });
    }
  }

  dismissModal(success = false) {
    this.modalController.dismiss({
      success: success
    });
  }
}
