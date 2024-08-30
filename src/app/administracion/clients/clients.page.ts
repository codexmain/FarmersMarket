import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController} from '@ionic/angular';
import { AddClientPage } from '../add-client/add-client.page';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {

  constructor(private modalController: ModalController) {}

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
      this.items.push(`Cliente ${count + i}`);  //aca se cambia el nombre del como se muestra en el html.
    }
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);}

    async presentModal() {
      const modal = await this.modalController.create({
        component: AddClientPage
      });
  
      return await modal.present();}






}
