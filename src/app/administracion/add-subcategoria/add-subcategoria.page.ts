import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-subcategoria',
  templateUrl: './add-subcategoria.page.html',
  styleUrls: ['./add-subcategoria.page.scss'],
})
export class AddSubcategoriaPage implements OnInit {

  constructor(private modalController: ModalController, private menu: MenuController, private route: ActivatedRoute, private router: Router, public alertController: AlertController, private navParams: NavParams) { 
  }

  subCategoryName: string = '';
  category!: number;


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

  async agregarSubCategoria(){

  if (!this.subCategoryName) {
    this.presentAlert('Error', 'La SubCategoría es un campo obligatorio.');
    return;}
  

  const subCategoryPattern = /^[a-zA-Z0-9\s]{5,50}$/;
  if (this.subCategoryName && !subCategoryPattern.test(this.subCategoryName)) {
    this.presentAlert('Error', 'El nombre de la Subcategoría debe tener entre 5 y 50 caracteres. Y solo debe contener letras, números y espacios');
    return;
  }
  // Validar región
  if (!this.category) {
     this.presentAlert('Error', 'La Categoría es obligatoria.');
     return;}
    // Si todas las validaciones pasan
    this.presentAlert('Éxito', 'Su ha agregado el cliente exitosamente.');
    console.log('Formulario válido, proceder con el registro.');
    this.modalController.dismiss();
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
