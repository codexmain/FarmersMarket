import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-categoria',
  templateUrl: './add-categoria.page.html',
  styleUrls: ['./add-categoria.page.scss'],
})
export class AddCategoriaPage implements OnInit {

  constructor(private modalController: ModalController, private menu: MenuController, private route: ActivatedRoute, private router: Router, public alertController: AlertController, private navParams: NavParams) { 
  }

  //inputs del formulario
  categoryName: string = '';

  ngOnInit() {
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  async agregarCategoria(){
  // Validar categoría
  if (!this.categoryName) {
    this.presentAlert('Error', 'La empresa es un campo obligatorio.');
    return;}


  // validar formato categoria

  const categoryPattern = /^[a-zA-Z0-9\s]{5,50}$/;
  if (this.categoryName && !categoryPattern.test(this.categoryName)) {
    this.presentAlert('Error', 'El nombre de la categoría debe tener entre 5 y 50 caracteres. Y solo debe contener letras, números y espacios');
    return;
  }

    // Si todas las validaciones pasan
    this.presentAlert('Éxito', 'Se ha agregado la Categoría exitosamente.');
    console.log('Formulario válido, proceder con el registro.');
    this.modalController.dismiss();

  };

  dismiss() {
    this.modalController.dismiss();
  }

}
