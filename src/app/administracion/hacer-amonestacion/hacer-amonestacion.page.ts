import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { AmonestacionesssService } from '../../services/amonestacionesss.service';
import { DataBaseService } from '../../services/data-base.service';


@Component({
  selector: 'app-hacer-amonestacion',
  templateUrl: './hacer-amonestacion.page.html',
  styleUrls: ['./hacer-amonestacion.page.scss'],
})
export class HacerAmonestacionPage implements OnInit {

  usuario: any //para la transferencia de argumentos de navParams
  isDisabledCorreo = true;

  isDisabledIdProd = true

  arrayCmbProductos: any = [
    {
      id: '',
      nombre: '',
    }
  ]

  usuario_id!: number;
  email: string = '';
  descripcion: string = '';
  id_producto: number | null | undefined;




  constructor(
    private modalController: ModalController,
    private amonestacionesssService: AmonestacionesssService,
    private navParams: NavParams,
    private bd: DataBaseService,
    public alertController: AlertController

  ) {
    this.usuario = this.navParams.get('usuario'); //obtener todos los datos del usuario en especifico

  }

  ngOnInit() {

    this.usuario_id = this.usuario.id; //TRAER EL ID DEL USUARIO PAARA HACER LA AMONESTACION
    this.cargarProductos();
    this.email = this.usuario.email;
  }

  cargarProductos() {
    if (this.usuario_id) {
      this.bd.seleccionarCmbProdaAmonestar(this.usuario_id).then(() => {
        this.bd.fetchCmbProdAmnstones().subscribe(res => {
          this.arrayCmbProductos = res; // Asigna las productos obtenidos
        });
      });
      this.isDisabledIdProd = false;
    } else {
      // dejar como undefined
      this.id_producto = null; // Reiniciar comuna seleccionada
      this.isDisabledIdProd = true;
    }
  }

  async hacerAmonestacion() {
    const isValid = await this.validateFields();

    if (!isValid) {
      return; // Si hay errores, salimos
    }

    // Insertar amonestación en la base de datos
    await this.bd.insertarAmonestacion(this.usuario_id, this.id_producto as number, this.descripcion);

    // Usamos subscribe() en lugar de then()
    this.amonestacionesssService.enviarAmonestacion(this.email, this.descripcion, this.id_producto).subscribe({
      next: () => {
        console.log('Amonestación enviada');
        this.modalController.dismiss({ success: true }); // Cierra el modal con éxito
      },
      error: (error) => {
        console.error('Error al enviar la amonestación:', error);
      }
    });
  }


  async validateFields() {
    // Validación de la descripción del producto

    if (!this.descripcion) {
      this.presentAlert('Error', 'La descripcion de la amonestación es un campo obligatorio.');
      return;
    }

    if
      (this.descripcion.length < 10 || this.descripcion.length > 255) {
      this.presentAlert('Error', 'La Descripción de la amonestacion debe tener entre 10 y 255 caracteres.');
      return;
    }

    return true

  }

  dismiss() {
    this.modalController.dismiss();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  clearDescripcion() {
    this.descripcion = '';
  }

  clearProducto() {
    this.id_producto = null;
  }
}
