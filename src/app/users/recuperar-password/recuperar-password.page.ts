import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController, AlertController  } from '@ionic/angular';
@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
  
})
export class RecuperarPasswordPage implements OnInit {


  constructor(private modalController: ModalController, private menu: MenuController, public alertController: AlertController) {}



  
  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }



  enviar(){}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: '',
      buttons: ['OK']
    });

    await alert.present();}

    async presentAlertPrompt() {
      const alert = await this.alertController.create({
        header: 'Cambio de contraseña.',
        subHeader: 'Ingrese los campos para restaurar la contraseña',
        inputs: [
          {
            name: 'password',
            type: 'text',
            placeholder: 'Nueva Contraseña'
          },
          {
            name: 'confirmPassword',
            type: 'text',
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
              console.log('Confirm Ok', data);
            }
          }
        ]
      });
    
      await alert.present();
    }
    

    
    
  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
