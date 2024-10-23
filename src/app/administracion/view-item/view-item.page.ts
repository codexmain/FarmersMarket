import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DataBaseService } from '../../services/data-base.service';
@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.page.html',
  styleUrls: ['./view-item.page.scss'],
})
export class ViewItemPage implements OnInit {
  isDisabled = true;
  producto: any //para la transferencia de argumentos de navParams

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

  constructor(private modalController: ModalController, private navParams: NavParams, private bd: DataBaseService) { 
    this.producto = this.navParams.get('producto');
  }

  ngOnInit() {
    this.proveedor_id = this.producto.proveedor_id;
    this.nombre_producto = this.producto.nombre_producto;
    this.descripcion_producto = this.producto.descripcion_producto;
    this.precio = this.producto.precio;
    this.stock = this.producto.stock;
    this.organico = this.producto.organico;
    this.categoria_id = this.producto.categoria_id;
    this.subcategoria_id = this.producto.subcategoria_id;
    this.photo = this.producto.photo;


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



  dismiss() {
    this.modalController.dismiss();
  } 

}
