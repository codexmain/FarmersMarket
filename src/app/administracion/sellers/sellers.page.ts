import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController, InfiniteScrollCustomEvent} from '@ionic/angular';
import { AddSellerPage } from '../add-seller/add-seller.page'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.page.html',
  styleUrls: ['./sellers.page.scss'],
})
export class SellersPage implements OnInit {
  emails: string[] = []; 

  constructor(private modalController: ModalController, private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {  //recibir de admin page el array de correos
      this.emails = navigation.extras.state['emails'];
    }
  }

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
    console.log(this.emails);
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

    async presentModal() {
      const modal = await this.modalController.create({
        component: AddSellerPage,
        componentProps: { emails: this.emails }
      });
  
      return await modal.present();}

}


