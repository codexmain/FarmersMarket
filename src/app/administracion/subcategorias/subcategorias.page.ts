import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController} from '@ionic/angular';
import { AddSubcategoriaPage } from '../add-subcategoria/add-subcategoria.page'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subcategorias',
  templateUrl: './subcategorias.page.html',
  styleUrls: ['./subcategorias.page.scss'],
})
export class SubcategoriasPage implements OnInit {

  constructor(private modalController: ModalController, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddSubcategoriaPage
    });
    
    return await modal.present();}

}
