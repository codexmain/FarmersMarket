import { Component, OnInit } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-view-subcategoria',
  templateUrl: './view-subcategoria.page.html',
  styleUrls: ['./view-subcategoria.page.scss'],
})
export class ViewSubcategoriaPage implements OnInit {
  isDisabled = true;
  subcategoria: any //para la transferencia de argumentos de navParams

  nombre: string = '';
  categoria_id!: number;  

  arrayCmbCategorias: any = [
    {
      id: '',
      nombre: ''
    }
  ]

  constructor(private modalController: ModalController, private navParams: NavParams, private bd: DataBaseService) {
    this.subcategoria = this.navParams.get('subcategoria');
   }

  ngOnInit(){
    this.nombre = this.subcategoria.nombre;
    this.categoria_id = this.subcategoria.categoria_id;

    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        this.bd.fetchCategorias().subscribe(res=>{
          this.arrayCmbCategorias = res;
        })  
      }
    })
  }

  dismiss() {
    this.modalController.dismiss();
  }  

}
