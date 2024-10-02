import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  productName: string = '';
  descProduct: string = '';
  productPrice!: number;
  stock: number = 0;
  isOrganic: boolean = false;
  seller!: number;
  category!: number;
  subCategory!: number;
  photo: string = ''; // Ruta de la foto

  constructor(private modalController: ModalController, private menu: MenuController, private route: ActivatedRoute, private router: Router, public alertController: AlertController, private navParams: NavParams) { }



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

  //validacion de formato de los precios
  validarPrecio(precio: number): boolean {
    const esEntero = Number.isInteger(precio);
    const esValido = esEntero && precio > 0 && precio <= 9999999;
    return esValido;
  }

  //validar el formato del stock
  validarStock(precio: number): boolean {
    const esEntero = Number.isInteger(precio);
    const esValido = esEntero && precio >= 0 && precio <= 99999; //se declara una longitud de cinco, y que sea mayor o igual a cero, puede que el vendedor quisiera crear solamente el producto
    return esValido;
  }  

  async agregarProducto(){ 

    if (!this.seller) {
      this.presentAlert('Error', 'El Vendedor es un campo obligatorio.');
      return;}

    if (!this.productName) {
      this.presentAlert('Error', 'El Nombre del Producto es un campo obligatorio.');
      return;}


    if (!this.productPrice) {
      this.presentAlert('Error', 'El Precio del producto es un campo obligatorio.');
      return;}

    console.log('Valor de productStock:', this.stock);
    if (this.stock === null || this.stock === undefined) {
      this.presentAlert('Error', 'El Stock/Existencias es un campo obligatorio.');
      return;
    }

    if (!this.category) {
      this.presentAlert('Error', 'La Categoría es un campo obligatorio.');
      return;}
      
    if (!this.subCategory) {
      this.presentAlert('Error', 'La Subcategoría es un campo obligatorio.');
      return;}    
      
    if (this.productName.length < 3 || this.productName.length > 40) {
      this.presentAlert('Error', 'El Nombre del producto debe tener entre 3 y 40 caracteres.');
      return;}  
      
    if (!this.validarPrecio(this.productPrice)) {
      this.presentAlert('Error', 'El Precio del producto debe ser un número entero mayor a 0 y no debe superar las 7 cifras.');
      return;}
    
    if (!this.validarStock(this.stock)) {
      this.presentAlert('Error', 'El Stock del producto debe ser un número entero mayor o igual cero y no debe superar las 5 cifras.');
      return;}    
  }



  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt // Permite al usuario elegir entre cámara y galería
    });

    this.photo = image.webPath || ''; 
  }








  dismiss() {
    this.modalController.dismiss();
  }

  
  
  }