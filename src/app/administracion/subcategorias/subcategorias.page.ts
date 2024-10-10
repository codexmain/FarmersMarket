import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController} from '@ionic/angular';
import { AddSubcategoriaPage } from '../add-subcategoria/add-subcategoria.page'
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service'



@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.page.html',
  styleUrls: ['./subcategorias.page.scss'],
})
export class SubcategoriasPage implements OnInit {

  constructor(private bd: DataBaseService, private modalController: ModalController, private route: ActivatedRoute, private router: Router) { }

  arraySubCategorias: any = [
    {
      id: '',
      nombre: '',
      categoria_id: ''
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
  

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddSubcategoriaPage
    });
    
    return await modal.present();}

}
