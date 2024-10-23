import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController, ToastController} from '@ionic/angular';

import { DataBaseService } from '../../services/data-base.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-modificar-item',
  templateUrl: './modificar-item.page.html',
  styleUrls: ['./modificar-item.page.scss'],
})
export class ModificarItemPage implements OnInit {
  producto: any //para la transferencia de argumentos de navParams
  isDisabled = true;

  proveedor_id!: number;
  nombre_producto: string = '';
  descripcion_producto: string = '';
  precio!: number;
  stock: number;
  organico: number; //default de organico en false
  categoria_id!: number;
  subcategoria_id: number | undefined;
  photo: string = ''; // Ruta de la foto

  arrayCmbProvedores: any = [
    {
      id: '',
      nombre_empresa: ''
    }
  ]

  arrayCmbCategorias: any = [
    {
      id: '',
      nombre: ''
    }
  ]

  arrayCmbSubcategorias: any = [
    {
      id: '',
      nombre: ''
    }
  ]
  foto_perfil: string='';
  imagen: any;


  constructor(private toastController: ToastController, private modalController: ModalController, private navParams: NavParams, private bd: DataBaseService, public alertController: AlertController) {
    this.producto = this.navParams.get('producto');
   }

   ngOnInit() {
    this.bd.dbState().subscribe(data => {
      // Validar si la bd está lista
      if (data) {
        // Suscribirse al observable de las listas
        this.bd.fetchCmbProveedores().subscribe(res => {
          this.arrayCmbProvedores = res;
        });

        this.bd.fetchCategorias().subscribe(res => {
          this.arrayCmbCategorias = res;
          this.categoria_id = this.producto.categoria_id; // Cargar la categoría del producto
          this.onCategoriaChange({ detail: { value: this.categoria_id } }); // Cargar subcategorías
        });

        this.bd.fetchCmbSubCategorias().subscribe(res => {
          this.arrayCmbSubcategorias = res; // Asigna las subcategorías obtenidas
        });
      }
    });
    
    this.proveedor_id = this.producto.proveedor_id;
    this.nombre_producto = this.producto.nombre_producto;
    this.descripcion_producto = this.producto.descripcion_producto;
    this.precio = this.producto.precio;
    this.stock = this.producto.stock;
    this.organico = this.producto.organico;
    this.categoria_id = this.producto.categoria_id;
    this.subcategoria_id = this.producto.subcategoria_id;
    this.foto_perfil = this.producto.foto_perfil;
  }

  onCategoriaChange(event: any) {
    this.categoria_id = event.detail.value;

    if (this.categoria_id) {
      this.bd.seleccionarCmbSubCategorias(this.categoria_id).then(() => {
        this.bd.fetchCmbSubCategorias().subscribe(res => {
          this.arrayCmbSubcategorias = res; // Asigna las subcategorías obtenidas
          this.subcategoria_id = this.producto.subcategoria_id; // Establecer la subcategoría del producto
        });
      });
    } else {
      // Reiniciar la lista de subcategorías
      this.arrayCmbSubcategorias = [
        {
          id: '',
          nombre: '',
        }
      ];
      this.subcategoria_id = undefined; // Reiniciar subcategoría seleccionada
    }
  }



  async takePicture() { 
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    if (image && image.webPath) { 
      this.foto_perfil = image.webPath;
      this.imagen = image.webPath;
    }
  }

  //validacion de formato de los precios
  validarPrecio(precio: number): boolean {
    const esEntero = Number.isInteger(precio);
    const esValido = esEntero && precio > 0 && precio <= 9999999;
    return esValido;
  }

  //validar el formato del stock
  validarStock(stock: number): boolean {
    const esEntero = Number.isInteger(stock);
    const esValido = esEntero && stock >= 0 && stock <= 99999; //se declara una longitud de cinco, y que sea mayor o igual a cero, puede que el vendedor quisiera crear solamente el producto
    return esValido;
  }  

  async validateFields(){
    if (!this.proveedor_id) {
      this.presentAlert('Error', 'El Vendedor es un campo obligatorio.');
      return false;}

    if (!this.nombre_producto) {
      this.presentAlert('Error', 'El Nombre del Producto es un campo obligatorio.');
      return false;}

    // Validación de la descripción del producto
    if (this.descripcion_producto && 
      (this.descripcion_producto.length < 10 || this.descripcion_producto.length > 255)) {
       this.presentAlert('Error', 'La Descripción del producto debe tener entre 10 y 255 caracteres.');
       return false;
   }  


    if (!this.precio) {
      this.presentAlert('Error', 'El Precio del producto es un campo obligatorio.');
      return false;}

    if (this.stock === null || this.stock === undefined) {
      this.presentAlert('Error', 'El Stock/Existencias es un campo obligatorio.');
      return false;
    }

    if (!this.organico) {
      this.presentAlert('Error', 'La procedencia del producto(Orgánico/No Orgánico) es un campo obligatorio.');
      return false;}

    if (!this.categoria_id) {
      this.presentAlert('Error', 'La Categoría es un campo obligatorio.');
      return false;}
      
    if (!this.subcategoria_id) {
      this.presentAlert('Error', 'La Subcategoría es un campo obligatorio.');
      return false;}    
      
    if (this.nombre_producto.length < 3 || this.nombre_producto.length > 40) {
      this.presentAlert('Error', 'El Nombre del producto debe tener entre 3 y 40 caracteres.');
      return false;}  
      
    if (!this.validarPrecio(this.precio)) {
      this.presentAlert('Error', 'El Precio del producto debe ser un número entero mayor a 0 y no debe superar las 7 cifras.');
      return false;}
    
    if (!this.validarStock(this.stock)) {
      this.presentAlert('Error', 'El Stock del producto debe ser un número entero mayor o igual cero y no debe superar las 5 cifras.');
      return false;}

      return true;

  }



  async modificarProducto() {
    // Realiza validaciones
    const isValid = await this.validateFields();
    if (!isValid) {
      return; // Si hay errores, salimos
    }
      // Procede a actualizar el usuario en la base de datos
      const subcategoriaId = this.subcategoria_id as number
      await this.bd.modificarProducto(this.producto.id, this.proveedor_id,this.nombre_producto,
                                    this.descripcion_producto, this.precio, this.stock, this.organico, this.foto_perfil, subcategoriaId);
  
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

  clearProductName(){
    this.nombre_producto = '';
  }

  clearProductDesc(){
    this.descripcion_producto = '';
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }



}
