import { Component, OnInit } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service';
import { AlertController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-mod-cuenta',
  templateUrl: './mod-cuenta.page.html',
  styleUrls: ['./mod-cuenta.page.scss'],
})
export class ModCuentaPage implements OnInit {
  usuario: any = {
    id: 0,
    nombre: '',
    segundo_nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '', // Email no editable
    tipo_usuario_id: 1, // Asumiendo Cliente por defecto
  };

  constructor(
    private dataBase: DataBaseService,
    public alertController: AlertController,
    private nativeStorage: NativeStorage
  ) { }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      const usuarioData = await this.dataBase.obtenerUsuarioPorEmail(email);
      
      if (usuarioData) {
        this.usuario = usuarioData;
      } else {
        await this.presentAlert('Error', 'No se encontró el usuario.');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      await this.presentAlert('Error', 'Error al cargar los datos del usuario.');
    }
  }

  async actualizarUsuario() {
    try {
      const actualizado = await this.dataBase.actualizarUsuarioPorEmail(this.usuario);
      if (actualizado) {
        await this.presentAlert('Éxito', 'Usuario actualizado exitosamente.');
      } else {
        await this.presentAlert('Error', 'Hubo un problema al actualizar el usuario.');
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      await this.presentAlert('Error', 'Error al actualizar el usuario. Inténtalo más tarde.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}