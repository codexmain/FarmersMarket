import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-add-subcategoria',
  templateUrl: './add-subcategoria.page.html',
  styleUrls: ['./add-subcategoria.page.scss'],
})
export class AddSubcategoriaPage implements OnInit {

  arrayCmbCategorias: any = [
    {
      id: '',
      nombre: ''
    }
  ]

  nombre: string = '';
  categoria_id!: number;

  constructor(private bd: DataBaseService, private modalController: ModalController, private menu: MenuController, private route: ActivatedRoute, private router: Router, public alertController: AlertController, private navParams: NavParams) { 
  }






  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        this.bd.fetchCategorias().subscribe(res=>{
          this.arrayCmbCategorias = res;
        })  
      }
    })
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

  if (!this.nombre) {
    this.presentAlert('Error', 'La SubCategoría es un campo obligatorio.');
    return;}
  

  const subCategoryPattern = /^[a-zA-Z0-9\s]{5,50}$/;
  if (this.nombre && !subCategoryPattern.test(this.nombre)) {
    this.presentAlert('Error', 'El nombre de la Subcategoría debe tener entre 5 y 50 caracteres. Y solo debe contener letras, números y espacios');
    return;
  }
  // Validar región
  if (!this.categoria_id) {
     this.presentAlert('Error', 'La Categoría es obligatoria.');
     return;}
    // Si todas las validaciones pasan
    await this.bd.insertarSubCategoria(this.nombre,this.categoria_id);
    this.presentAlert('Éxito', 'Se ha agregado la Subcategoría exitosamente.');
    console.log('Formulario válido, proceder con el registro.');
    this.modalController.dismiss();
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
