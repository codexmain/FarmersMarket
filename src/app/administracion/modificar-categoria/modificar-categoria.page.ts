import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';

@Component({
  selector: 'app-modificar-categoria',
  templateUrl: './modificar-categoria.page.html',
  styleUrls: ['./modificar-categoria.page.scss'],
})
export class ModificarCategoriaPage implements OnInit {
  categoria: any;

  //inputs del formulario
  nombre: string = '';

  constructor(private bd: DataBaseService, private modalController: ModalController, private menu: MenuController, private route: ActivatedRoute, private router: Router, public alertController: AlertController, private navParams: NavParams) { 
    this.categoria = this.navParams.get('categoria');
  }


  ngOnInit() {
    this.nombre = this.categoria.nombre
  }

  async validateFields(){
    // Validar categoría
    if (!this.nombre) {
      this.presentAlert('Error', 'El nombre es un campo obligatorio.');
      return false;}
  
    // validar formato categoria
  
    const categoryPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]{5,50}$/;
    if (this.nombre && !categoryPattern.test(this.nombre)) {
      this.presentAlert('Error', 'El nombre de la categoría debe tener entre 5 y 50 caracteres. Y solo debe contener letras, números y espacios');
      return false;}
      return true
    }

  async modificarCategoria() {
    // Realiza validaciones
    const isValid = await this.validateFields();
    if (!isValid) {
      return; // Si hay errores, salimos
    }
      // Procede a actualizar el usuario en la base de datos
  
      await this.bd.modificarCategoria(this.categoria.id, this.nombre);
  
      this.modalController.dismiss({ success: true });}  
  

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  dismiss() {
    this.modalController.dismiss();
  }  

}
