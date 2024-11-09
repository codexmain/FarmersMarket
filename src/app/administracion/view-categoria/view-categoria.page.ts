import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service';
import { ModalController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-view-categoria',
  templateUrl: './view-categoria.page.html',
  styleUrls: ['./view-categoria.page.scss'],
})
export class ViewCategoriaPage implements OnInit {
  isDisabled = true;
  categoria: any;
  estado_categoria: string= '';


  //inputs del formulario
  nombre: string = '';


  constructor(private modalController: ModalController, private navParams: NavParams, private bd: DataBaseService) { 
    this.categoria = this.navParams.get('categoria');
  }

  ngOnInit() {
    this.nombre = this.categoria.nombre;
    this.estado_categoria = this.categoria.estado_categoria;
  }

  dismiss() {
    this.modalController.dismiss();
  }  

}
