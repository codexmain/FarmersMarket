import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
//usar para camara
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-proventas',
  templateUrl: './proventas.page.html',
  styleUrls: ['./proventas.page.scss'],
})
export class ProventasPage implements OnInit {
  
  // variables proventas
  titulo: string = '';
  valor!: number;
  descripcion: string = '';
  stock!: number;
  pImagen: string = '';

  constructor(
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    //usar para camara
    private camera: Camera,
    private nativeStorage: NativeStorage
  ) { }

  ngOnInit() {
  }

    // tomar foto del producto
    tomarFotop() {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
      };
  
      this.camera.getPicture(options).then((imageData) => {
        this.pImagen = 'data:image/jpeg;base64,' + imageData;
        this.nativeStorage.setItem('pImagen', { image: this.pImagen })
          .then(() => console.log('Imagen del producto guardada en Native Storage'))
          .catch(error => console.error('Error al guardar imagen del producto', JSON.stringify(error)));
      }, (err) => {
        console.error('Error al tomar foto del producto', JSON.stringify(err));
      });
    }
  

  // alerta
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // agregar un producto con validaciones
  async agregarProducto() {
    // título
    if (!this.titulo) {
      this.presentAlert('Error', 'El título del producto es obligatorio.');
      return;
    }

    // formato del título
    const titlePattern = /^[a-zA-Z0-9\s]{3,50}$/;
    if (!titlePattern.test(this.titulo)) {
      this.presentAlert('Error', 'El título debe tener entre 3 y 50 caracteres y solo contener letras, números y espacios.');
      return;
    }

    // valor
    if (!this.valor || this.valor < 1 || this.valor > 999999) {
      this.presentAlert('Error', 'El valor del producto debe ser mayor a 0 y no debe exceder 999,999.');
      return;
    }

    // descripción
    if (!this.descripcion) {
      this.presentAlert('Error', 'La descripción del producto es obligatoria.');
      return;
    }

    // formato de la descripción
    const descPattern = /^[a-zA-Z0-9\s.,!?]{15,500}$/;
    if (!descPattern.test(this.descripcion)) {
      this.presentAlert('Error', 'La descripción debe tener entre 15 y 500 caracteres y solo puede contener letras, números y algunos caracteres de puntuación.');
      return;
    }

    // stock
    if (!this.stock || this.stock < 1 || this.stock > 99) {
      this.presentAlert('Error', 'El stock debe ser un número positivo entre 1 y 99.');
      return;
    }

    // todas las validaciones pasan
    this.presentAlert('Éxito', 'El producto ha sido agregado exitosamente.');
    this.modalController.dismiss();
  }

  // cerrar el modal
  dismiss() {
    this.modalController.dismiss();
  }
}
