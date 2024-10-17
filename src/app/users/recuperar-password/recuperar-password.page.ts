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
            if (data.newPassword.length < 10) {
              await this.presentAlert('Error', 'La contraseña debe tener al menos 10 caracteres.');
              return false; // Si la contraseña es inválida
            }
  
            try {
              await this.DataBase.actualizarcon(this.correo, data.newPassword);
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
