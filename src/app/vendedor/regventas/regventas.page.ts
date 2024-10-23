import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-regventas',
  templateUrl: './regventas.page.html',
  styleUrls: ['./regventas.page.scss'],
})
export class RegventasPage implements OnInit {
  productosComprados: any[] = [];
  emailVendedor: string = '';

  constructor(
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage
  ) {}

  async ngOnInit() {
    try {
      // Obtener el email del Native Storage
      const storedEmail = await this.nativeStorage.getItem('userEmail');
      this.emailVendedor = storedEmail;

      // Verificar si se obtuvo un email válido
      if (this.emailVendedor) {
        // Obtener productos vendidos por vendedor
        this.productosComprados = await this.dbService.getProductosVendidosVendedor(this.emailVendedor);
      } else {
        console.warn('No se encontró un email en Native Storage.');
      }
    } catch (error) {
      console.error('Error al obtener el registro de ventas:', error);
    }
  }
}