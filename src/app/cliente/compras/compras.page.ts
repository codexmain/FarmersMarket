import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {
  productosComprados: any[] = [];
  carrosComprados: any = {}; // Agrupado por fecha
  email: string = '';

  constructor(private dbService: DataBaseService, private nativeStorage: NativeStorage) {}

  async ngOnInit() {
    this.email = await this.nativeStorage.getItem('userEmail');
    const carros = await this.dbService.getCarrosPorUsuario(this.email);
    
    for (const carro of carros) {
      const fecha = carro.fecha_creacion.split(' ')[0];
      if (!this.carrosComprados[fecha]) this.carrosComprados[fecha] = [];
      this.carrosComprados[fecha].push(carro);
  
      carro.productos = await this.dbService.getProductosCompradosPorCarroId(carro.id);
    }
  }

  getFechasCarros(): string[] {
    return Object.keys(this.carrosComprados);
  }
}
