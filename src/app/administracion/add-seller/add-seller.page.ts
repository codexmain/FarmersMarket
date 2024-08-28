import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';

interface RegionesComunas { //permite hacer la dependencia de comuna / region, para que sea interactivo cada vez que se cambie la region, se vean diferentes comunas
  [key: string]: string[];
}

@Component({
  selector: 'app-add-seller',
  templateUrl: './add-seller.page.html',
  styleUrls: ['./add-seller.page.scss'],
})
export class AddSellerPage implements OnInit {

  constructor(private modalController: ModalController, private menu: MenuController) { }

  selectedRegion: string = '';
  comunas: string[] = [];

  regionesComunas: RegionesComunas = {
    arica: ['Arica', 'Camarones'],
    tarapaca: ['Iquique', 'Alto Hospicio'],
    antofagasta: ['Antofagasta', 'Mejillones'],
    atacama: ['Copiapó', 'Caldera'],
    coquimbo: ['La Serena', 'Coquimbo'],
    valparaiso: ['Valparaíso', 'Viña del Mar'],
    metropolitana: ['Santiago', 'Puente Alto'],
    ohiggins: ['Rancagua', 'San Fernando'],
    maule: ['Talca', 'Curicó'],
    nuble: ['Chillán', 'San Carlos'],
    biobio: ['Concepción', 'Los Ángeles'],
    araucania: ['Temuco', 'Villarrica'],
    rios: ['Valdivia', 'La Unión'],
    lagos: ['Puerto Montt', 'Osorno'],
    aysen: ['Coyhaique', 'Puerto Aysén'],
    magallanes: ['Punta Arenas', 'Puerto Natales']
  };
  

  onRegionChange(event: any) {
    this.selectedRegion = event.detail.value;
    this.comunas = this.regionesComunas[this.selectedRegion] || [];
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  agregar(){}

  ngOnInit() {
  }

}
