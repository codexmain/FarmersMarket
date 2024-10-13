import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DataBaseService } from '../../services/data-base.service';


@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

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


  proveedor_id!: number;
  nombre: string = '';
  descripcion: string = '';
  precio!: number;
  stock: number = 0;
  organico: number = 0; //default de organico en false
  categoria_id!: number;
  subcategoria_id: number | undefined;


  constructor(private bd: DataBaseService, private modalController: ModalController, private menu: MenuController, private route: ActivatedRoute, private router: Router, public alertController: AlertController, private navParams: NavParams) { }



  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchCmbProveedores().subscribe(res=>{
          this.arrayCmbProvedores = res;
        })

        this.bd.fetchCategorias().subscribe(res=>{
          this.arrayCmbCategorias = res;
        })  

        this.bd.fetchCmbSubCategorias().subscribe(res=>{
          this.arrayCmbSubcategorias = res;
        })       
      }
    })
  }

  onCategoriaChange(event: any) {
    this.categoria_id = event.detail.value;
    if (this.categoria_id) {
      this.bd.seleccionarCmbSubCategorias(this.categoria_id).then(() => {
        this.bd.fetchCmbSubCategorias().subscribe(res => {
          this.arrayCmbSubcategorias = res; // Asigna las comunas obtenidas
        });
      });
    } else {
      // Reiniciar la lista de comunas a la estructura inicial
      this.arrayCmbSubcategorias = [
        {
          id: '',
          nombre: '',
        }
      ];
      this.subcategoria_id = undefined; // Reiniciar comuna seleccionada
    }
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
  validarStock(stock: number): boolean {
    const esEntero = Number.isInteger(stock);
    const esValido = esEntero && stock >= 0 && stock <= 99999; //se declara una longitud de cinco, y que sea mayor o igual a cero, puede que el vendedor quisiera crear solamente el producto
    return esValido;
  }  


  
  async agregarProducto(){ 

    if (!this.proveedor_id) {
      this.presentAlert('Error', 'El Vendedor es un campo obligatorio.');
      return;}

    if (!this.nombre) {
      this.presentAlert('Error', 'El Nombre del Producto es un campo obligatorio.');
      return;}


    if (!this.precio) {
      this.presentAlert('Error', 'El Precio del producto es un campo obligatorio.');
      return;}

    if (this.stock === null || this.stock === undefined) {
      this.presentAlert('Error', 'El Stock/Existencias es un campo obligatorio.');
      return;
    }

    if (!this.organico) {
      this.presentAlert('Error', 'La procedencia del producto(Orgánico/No Orgánico) es un campo obligatorio.');
      return;}

    if (!this.categoria_id) {
      this.presentAlert('Error', 'La Categoría es un campo obligatorio.');
      return;}
      
    if (!this.subcategoria_id) {
      this.presentAlert('Error', 'La Subcategoría es un campo obligatorio.');
      return;}    
      
    if (this.nombre.length < 3 || this.nombre.length > 40) {
      this.presentAlert('Error', 'El Nombre del producto debe tener entre 3 y 40 caracteres.');
      return;}  
      
    if (!this.validarPrecio(this.precio)) {
      this.presentAlert('Error', 'El Precio del producto debe ser un número entero mayor a 0 y no debe superar las 7 cifras.');
      return;}
    
    if (!this.validarStock(this.stock)) {
      this.presentAlert('Error', 'El Stock del producto debe ser un número entero mayor o igual cero y no debe superar las 5 cifras.');
      return;}

      // Si todas las validaciones pasan
      await this.bd.insertarProducto(
        this.proveedor_id, this.nombre, this.descripcion, this.precio, this.stock, 
        this.organico, '', this.subcategoria_id
      );
      this.presentAlert('Éxito', 'Su ha agregado el Producto exitosamente.');
      console.log('Formulario válido, proceder con el registro.');
      this.modalController.dismiss();
    }










  dismiss() {
    this.modalController.dismiss();
  }

  
  
  }