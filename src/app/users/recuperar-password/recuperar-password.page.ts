import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController  } from '@ionic/angular';
@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
  
})
export class RecuperarPasswordPage implements OnInit {


  constructor(private modalController: ModalController, private menu: MenuController) {}

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  enviar(){}

  ngOnInit() {
  }

}
