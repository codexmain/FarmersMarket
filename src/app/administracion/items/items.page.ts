import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController} from '@ionic/angular';
import { AddItemPage } from '../add-item/add-item.page'
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  constructor(private modalController: ModalController, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddItemPage
    });
    
    return await modal.present();}

}
