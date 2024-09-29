import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController} from '@ionic/angular';
import { AddUsuariosPage } from '../add-usuarios/add-usuarios.page'
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
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
      text: 'Editar',
      data: {
        action: 'update',
      },
    },
    {
      text: 'Visualizar',
      data: {
        action: 'read',
      },
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      data: {
        action: 'delete',
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
    console.log(this.emails);
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i <= 50; i++) {
      this.items.push(`Usuario ${count + i}`);  //aca se cambia el nombre del como se muestra en el html.
    }
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);}


    async presentModal() {
      const modal = await this.modalController.create({
        component: AddUsuariosPage,
        componentProps: { emails: this.emails }
      });
  
      return await modal.present();}

}


