import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-regventas',
  templateUrl: './regventas.page.html',
  styleUrls: ['./regventas.page.scss'],
})
export class RegventasPage implements OnInit {
  productosVendidos: any[] = [];
  emailVendedor: string = '';

  constructor(
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage
  ) {}

  async ngOnInit() {
    try {
      this.emailVendedor = await this.nativeStorage.getItem('userEmail');
      if (this.emailVendedor) {
        this.productosVendidos = await this.dbService.getProductosVendidosPorVendedor(this.emailVendedor);
      }
    } catch (error) {
      console.error('Error al obtener el registro de ventas:', error);
    }
  }
}