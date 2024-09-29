import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController} from '@ionic/angular';
import { AddCategoriaPage } from '../add-categoria/add-categoria.page'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
})
export class CategoriasPage implements OnInit {

  constructor(private modalController: ModalController, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: AddCategoriaPage
    });

    return await modal.present();}

}
