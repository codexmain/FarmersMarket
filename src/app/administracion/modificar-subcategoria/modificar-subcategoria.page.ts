import { Component, OnInit } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service';
import { ModalController, NavParams, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modificar-subcategoria',
  templateUrl: './modificar-subcategoria.page.html',
  styleUrls: ['./modificar-subcategoria.page.scss'],
})
export class ModificarSubcategoriaPage implements OnInit {
  subcategoria: any //para la transferencia de argumentos de navParams

  nombre: string = '';
  categoria_id!: number;  

  arrayCmbCategorias: any = [
    {
      id: '',
      nombre: ''
    }
  ]
  constructor(private modalController: ModalController, private navParams: NavParams, private bd: DataBaseService, public alertController: AlertController) {
    this.subcategoria = this.navParams.get('subcategoria');
   }

  ngOnInit() {
    this.nombre = this.subcategoria.nombre;
    this.categoria_id = this.subcategoria.categoria_id;

    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        this.bd.fetchCategorias().subscribe(res=>{
          this.arrayCmbCategorias = res;
        })  
      }
    })
  }


  async validateFields(){
    if (!this.nombre) {
      this.presentAlert('Error', 'La SubCategoría es un campo obligatorio.');
      return false;}
    
  
    const subCategoryPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]{5,50}$/;
    if (this.nombre && !subCategoryPattern.test(this.nombre)) {
      this.presentAlert('Error', 'El nombre de la Subcategoría debe tener entre 5 y 50 caracteres. Y solo debe contener letras, números y espacios');
      return false;
    }
    // Validar región
    if (!this.categoria_id) {
       this.presentAlert('Error', 'La Categoría es obligatoria.');
       return false;}

       return true;
}

async modificarSubcategoria() {
  // Realiza validaciones
  const isValid = await this.validateFields();
  if (!isValid) {
    return; // Si hay errores, salimos
  }
    // Procede a actualizar el usuario en la base de datos

    await this.bd.modificarSubCategoria(this.subcategoria.id, this.nombre,this.categoria_id);

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


