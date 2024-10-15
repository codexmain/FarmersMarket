import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController} from '@ionic/angular';
import { AddCategoriaPage } from '../add-categoria/add-categoria.page'
import { ViewCategoriaPage } from '../view-categoria/view-categoria.page';
import { ModificarCategoriaPage } from '../modificar-categoria/modificar-categoria.page';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { Categorias } from 'src/app/services/categorias';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {

  constructor(private bd: DataBaseService, private actionSheetController: ActionSheetController,private modalController: ModalController, private route: ActivatedRoute, private router: Router) { }

  arrayCategorias: any = [
    {
      id: '',
      nombre: ''

    }
  ]

  searchTerm: string = '';

  filteredCategorias: any = [
    {
      id: '',
      nombre: ''

    }
  ]



  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchCategorias().subscribe(res=>{
          this.arrayCategorias = res;
          this.filteredCategorias = res; // Inicialmente, mostrar todas las categorías
        })
      }
    })
  }

  // Método para filtrar las categorías
  searchCategorias() {
    if (this.searchTerm.trim() === '') {
      // Si el searchTerm está vacío, mostrar todas las categorías
      this.filteredCategorias = this.arrayCategorias;
    } else {
      // Filtrar las categorías
      this.filteredCategorias = this.arrayCategorias.filter((cat: Categorias) => 
        cat.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
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


  async presentModal() {
    const modal = await this.modalController.create({
      component: AddCategoriaPage
    });

    return await modal.present();}

    async modificar(x: any) {
      const modal = await this.modalController.create({
        component: ModificarCategoriaPage, //crear la pagina de edicio
        componentProps: { categoria: x }
      });
      modal.onDidDismiss().then(() => {
      });
      return await modal.present();
    }
  
    async visualizar(x: any) {
      const modal = await this.modalController.create({
        component: ViewCategoriaPage, //crear la pagina de visualizacion
        componentProps: { categoria: x }
      });
      return await modal.present();
    }

    eliminar(x: any) {
      this.bd.eliminarCategoria(x.id, x.nombre)
    }

    agregar() {
      this.presentModal(); // Mostrar modal para agregar usuario
    }

}
