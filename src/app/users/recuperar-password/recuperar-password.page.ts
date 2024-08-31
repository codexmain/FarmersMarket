import { Component, OnInit } from '@angular/core';

import { ModalController, AlertController, NavParams  } from '@ionic/angular';
@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
  
})
export class RecuperarPasswordPage implements OnInit {



  constructor(private modalController: ModalController, public alertController: AlertController, private navParams: NavParams) {}

  isDesactivado: boolean = true;
  correo : string = '';
  emails: string[] = [];

  async recuperarPassword() { 
    this.emails = this.navParams.get('emails');
    if (this.emails.includes(this.correo)) {
      this.isDesactivado = false; // Habilita el botón si el correo existe en el arreglo
    } 
    else {
      this.isDesactivado = true; // Deshabilita el botón si el correo no existe en el arreglo
      
    }
  }

async presentAlertPrompt() {
  const alert = await this.alertController.create({
    header: 'Cambio de contraseña.',
    subHeader: 'Ingrese los campos para restaurar la contraseña',
    inputs: [
      {
        name: 'password',
        type: 'password',
        placeholder: 'Nueva Contraseña'
      },
      {
        name: 'confirmPassword',
        type: 'password',
        placeholder: 'Vuelve a escribir la contraseña'
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (data) => {
          const password = data.password;
          const confirmPassword = data.confirmPassword;

          if (!password || !confirmPassword) {
            this.presentAlert('Error', 'Los campos no pueden estar vacíos.');
            return false;
          }

          if (password.length < 10 || password.length > 30) {
            this.presentAlert('Error', 'La contraseña debe tener entre 10 y 30 caracteres.');
            return false;
          }

          if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            this.presentAlert('Error', 'La contraseña debe contener al menos un carácter especial.');
            return false;
          }

          if (/(\d)\1/.test(password) || /([a-zA-Z])\1/.test(password)) {
            this.presentAlert('Error', 'La contraseña no debe contener caracteres o números consecutivos repetidos.');
            return false;
          }
          if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
            this.presentAlert('Error', 'La contraseña debe contener al menos dos letras mayúsculas.');
            return false;
          }

          if (password !== confirmPassword) {
            this.presentAlert('Error', 'Las contraseñas no coinciden.');
            return false;
          }

          this.presentAlert('Éxito', 'La contraseña ha sido cambiada exitosamente.');
          console.log('Confirm Ok', data);
          return true;

        }
      }
    ]
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
