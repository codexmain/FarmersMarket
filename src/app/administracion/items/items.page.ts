import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController} from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page'
import { ModificarItemPage } from '../modificar-item/modificar-item.page';
import { ViewItemPage } from '../view-item/view-item.page';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { identity } from 'rxjs';


@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  constructor(private bd: DataBaseService, private actionSheetController: ActionSheetController,private modalController: ModalController, private route: ActivatedRoute, private router: Router) { }

  arrayProductos: any = [
    {
      id: '',
      proveedor_id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      organico: '',
      organicoEnTexto: '',
      foto_producto: '',
      subcategoria_id: '',
      fecha_agregado: '',
      nombre_subcategoria: '',
      categoria_id: '',
      nombre_proveedor: '',
      nombre_categoria: ''
    }
  ]


  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchProductos().subscribe(res=>{
          this.arrayProductos = res;
        })
      }
    })
  }

  async presentActionSheet(x: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Modificar',
          handler: () => this.modificar(x)
        },
        {
          text: 'Visualizar',
          handler: () => this.visualizar(x)
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminar(x)
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async presentModal() { //este present modal es para 
    const modal = await this.modalController.create({
      component: AddItemPage,
    });

    return await modal.present();}

  async modificar(x: any) {
    const modal = await this.modalController.create({
      component: ModificarItemPage, //crear la pagina de edicio
      componentProps: { producto: x }
    });
    modal.onDidDismiss().then(() => {
    });
    return await modal.present();
  }

  async visualizar(x: any) {
    const modal = await this.modalController.create({
      component: ViewItemPage, //crear la pagina de visualizacion
      componentProps: { producto: x }
    });
    return await modal.present();
  }

  eliminar(x: any) {
    this.bd.eliminarProducto(x.id)
  }
  
  agregar() {
    this.presentModal(); // Mostrar modal para agregar usuario
  }

}
