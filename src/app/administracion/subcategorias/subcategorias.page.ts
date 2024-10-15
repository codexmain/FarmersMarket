import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController} from '@ionic/angular';
import { AddSubcategoriaPage } from '../add-subcategoria/add-subcategoria.page'
import { ModificarSubcategoriaPage } from '../modificar-subcategoria/modificar-subcategoria.page';
import { ViewSubcategoriaPage } from '../view-subcategoria/view-subcategoria.page';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service'



@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.page.html',
  styleUrls: ['./subcategorias.page.scss'],
})
export class SubcategoriasPage implements OnInit {

  constructor(private bd: DataBaseService, private actionSheetController: ActionSheetController,private modalController: ModalController, private route: ActivatedRoute, private router: Router) { }

  arraySubCategorias: any = [
    {
      id: '',
      nombre: '',
      categoria_id: '',
      nombreCategoria: ''

    }
  ]

  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchSubCategorias().subscribe(res=>{
          this.arraySubCategorias = res;
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
      component: AddSubcategoriaPage,
    });

    return await modal.present();}

  async modificar(x: any) {
    const modal = await this.modalController.create({
      component: ModificarSubcategoriaPage, //crear la pagina de edicio
      componentProps: { subcategoria: x }
    });
    modal.onDidDismiss().then(() => {
    });
    return await modal.present();
  }

  async visualizar(x: any) {
    const modal = await this.modalController.create({
      component: ViewSubcategoriaPage, //crear la pagina de visualizacion
      componentProps: { subcategoria: x }
    });
    return await modal.present();
  }

  eliminar(x: any) {
    this.bd.eliminarSubcategoria(x.id, x.nombre, x.categoria_id)
  }
  
  agregar() {
    this.presentModal(); // Mostrar modal para agregar usuario
  }

}
