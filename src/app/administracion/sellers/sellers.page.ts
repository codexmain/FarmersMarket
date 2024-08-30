import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController, InfiniteScrollCustomEvent} from '@ionic/angular';
import { AddSellerPage } from '../add-seller/add-seller.page'

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.page.html',
  styleUrls: ['./sellers.page.scss'],
})
export class SellersPage implements OnInit {

  constructor(private modalController: ModalController, private menu: MenuController) {}

  items: string[] = [];

  public actionSheetButtons = [
    {
      text: 'Eliminar',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Editar',
      data: {
        action: 'edit',
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      }}

  ];



  ngOnInit() {
    this.generateItems();
  }


  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Vendedor ${count + i}`);  //aca se cambia el nombre del como se muestra en el html.
    }
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);}

    dismiss() {
    this.modalController.dismiss();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddSellerPage
    });

    return await modal.present();}  




}
