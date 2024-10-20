import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mod-usuario',
  templateUrl: './mod-usuario.page.html',
  styleUrls: ['./mod-usuario.page.scss'],
})
export class ModUsuarioPage implements OnInit {
  usuario = {
    nombre: '',
    segundo_nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: ''
  };

  constructor(
    private nativeStorage: NativeStorage,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const email = await this.nativeStorage.getItem('userEmail');
    this.usuario.email = email;
  }

  async actualizarUsuario() {
    // Lógica para actualizar el usuario en la base de datos.
    try {
      // Ejemplo: llamada a servicio de actualización aquí
      await this.mostrarAlerta('Éxito', 'Usuario actualizado correctamente');
    } catch (error) {
      await this.mostrarAlerta('Error', 'No se pudo actualizar el usuario');
    }
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
