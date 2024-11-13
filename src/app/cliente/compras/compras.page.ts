import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service'; // Asegúrate de que la ruta sea correcta
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx'; // Importar NativeStorage

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {
  productosComprados: any[] = [];
  carrosComprados: any[] = [];
  email: string ='';

  constructor(private dbService: DataBaseService, private nativeStorage: NativeStorage) { }

  async ngOnInit() {
    this.email = await this.nativeStorage.getItem('userEmail');
    this.productosComprados = await this.dbService.getProductosCompradosUsuario(this.email);
    this.carrosComprados = await this.dbService.getCarrosPorUsuario(this.email);

  }
}