import { Component, OnInit } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service';
import { MenuController, ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
})
export class RecuperarPasswordPage implements OnInit {
  correo: string = '';
  isDesactivado: boolean = true;
  codigoVerificacion: string = ''; // NUEVO: Almacena el código de verificación ingresado por el usuario

  constructor(
    private DataBase: DataBaseService,
    private alertController: AlertController, 
    private modalController: ModalController, 
    private menu: MenuController
  ) {}

  ngOnInit() {}

  // Verificar si el correo es válido para habilitar el botón
  onInputChange() {
    this.isDesactivado = !this.correo.includes('@');
  }

  // Lógica para iniciar el proceso de recuperación de contraseña
  async recuperarPassword() {
    try {
      // CAMBIO: Verificar si el correo existe en la base de datos y enviar el código de verificación
       const existe = await this.DataBase.recuperarcon(this.correo);
       if (existe) {
          this.presentCodigoVerificacionPrompt(); // NUEVO: Solicitar el código de verificación
        }
    } catch (error) {
      this.presentAlert('Error', 'Ocurrió un error al intentar verificar el correo.');
      throw error;
    }
  }
  

  // NUEVO: Alert para ingresar el código de verificación
  async presentCodigoVerificacionPrompt() {
    const alert = await this.alertController.create({
      header: 'Ingrese el Código de Verificación enviado a su correo',
      inputs: [
        {
          name: 'codigo',
          type: 'text',
          placeholder: 'Código de verificación',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Verificar',
          handler: async (data) => {
            // CAMBIO: Verificar que el código ingresado coincida con el guardado en localStorage
            if (data.codigo === localStorage.getItem('verificationCode')) {
              this.presentAlertPrompt(); // Mostrar el prompt para ingresar la nueva contraseña
              return true;
            } else {
              await this.presentAlert('Error', 'El código de verificación es incorrecto.');
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Alert para ingresar la nueva contraseña
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      inputs: [
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Ingrese nueva contraseña',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
            return true;
          },
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            const password = data.newPassword;

            // Validaciones de la contraseña
            if (password.length < 10 || password.length > 30) {
              await this.presentAlert('Error', 'La contraseña debe tener entre 10 y 30 caracteres.');
              return false;
            }

            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
              await this.presentAlert('Error', 'La contraseña debe contener al menos un carácter especial.');
              return false;
            }

            if (/(\d)\1/.test(password) || /([a-zA-Z])\1/.test(password)) {
              await this.presentAlert('Error', 'La contraseña no debe contener caracteres o números consecutivos repetidos.');
              return false;
            }

            if (!/(?=(.*[A-Z]){2})/.test(password)) {
              await this.presentAlert('Error', 'La contraseña debe contener al menos dos letras mayúsculas.');
              return false; 
            }

            // CAMBIO: Actualizar la contraseña en la base de datos si todas las validaciones son correctas
            try {
              await this.DataBase.resetPassword(this.correo, password);
              await this.presentAlert('Éxito', 'Contraseña actualizada correctamente.');
              this.dismiss();
              return true;
            } catch (error) {
              console.error('Error al actualizar la contraseña:', error);
              await this.presentAlert('Error', 'No se pudo actualizar la contraseña.');
              return false;
            }
          },
        },
      ],
    });
  
    await alert.present();
  }

  // Mostrar alertas de notificación
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
