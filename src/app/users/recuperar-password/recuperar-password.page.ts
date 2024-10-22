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


  constructor(
    private DataBase: DataBaseService,
    private alertController: AlertController, 
    private modalController: ModalController, 
    private menu: MenuController
  ) {}

  // Verificar si el correo es válido para habilitar el botón
  onInputChange() {
    this.isDesactivado = !this.correo.includes('@');
  }

  // Lógica para recuperar la contraseña
  async recuperarPassword() {
    try {
      const user = await this.DataBase.recuperarcon(this.correo);

      if (user) {
        await this.presentAlertPrompt();
      }
    } catch (error) {
      this.presentAlert('Error', 'El correo ingresado no está registrado.');
    }
  }

  // Alert para ingresar nueva contraseña
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
            return true; // Retornamos 'true' explícitamente
          },
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            // Validar la nueva contraseña
            const password = data.newPassword;

            // Validar longitud de la contraseña
            if (password.length < 10 || password.length > 30) {
              await this.presentAlert('Error', 'La contraseña debe tener entre 10 y 30 caracteres.');
              return false;
            }

            // Validar que contenga al menos un carácter especial
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
              await this.presentAlert('Error', 'La contraseña debe contener al menos un carácter especial.');
              return false;
            }

            // Validar que no contenga caracteres o números consecutivos repetidos
            if (/(\d)\1/.test(password) || /([a-zA-Z])\1/.test(password)) {
              await this.presentAlert('Error', 'La contraseña no debe contener caracteres o números consecutivos repetidos.');
              return false;
            }

            // Validar que contenga al menos dos letras mayúsculas
            if (!/(?=(.*[A-Z]){2})/.test(password)) {
              await this.presentAlert('Error', 'La contraseña debe contener al menos dos letras mayúsculas.');
              return false; 
            }

            // Si todas las validaciones son correctas
            try {
              await this.DataBase.actualizarcon(this.correo, password);
              await this.presentAlert('Éxito', 'Contraseña actualizada correctamente.');
              this.dismiss();
              return true; // Si todo va bien, retornamos 'true'
            } catch (error) {
              console.error('Error al actualizar la contraseña:', error);
              await this.presentAlert('Error', 'No se pudo actualizar la contraseña.');
              return false; // En caso de error, retornamos 'false'
            }
          },
        },
      ],
    });
  
    await alert.present();
  }


async presentAlert(header: string, message: string) {
  const alert = await this.alertController.create({
    header: header,
    message: message,
    buttons: ['OK']
  });

  await alert.present();
}

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
