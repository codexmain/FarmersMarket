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
  ventasAgrupadasPorFecha: any = {}; // Agrupado por fecha y luego por carro (ID de compra)
  emailVendedor: string = '';

  constructor(
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage
  ) {}

  async ngOnInit() {
    try {
      // Obtener el email del Native Storage
      this.emailVendedor = await this.nativeStorage.getItem('userEmail');

      if (this.emailVendedor) {
        // Obtener productos vendidos por el vendedor
        this.productosVendidos = await this.dbService.getProductosVendidosVendedor(this.emailVendedor);

        // Agrupar los productos vendidos por fecha de creación y luego por carro (ID de compra)
        for (const producto of this.productosVendidos) {
          const fecha = producto.fecha_creacion.split(' ')[0];
          if (!this.ventasAgrupadasPorFecha[fecha]) {
            this.ventasAgrupadasPorFecha[fecha] = {};
          }
          const carroId = producto.carro_id;
          if (!this.ventasAgrupadasPorFecha[fecha][carroId]) {
            this.ventasAgrupadasPorFecha[fecha][carroId] = {
              id: carroId,
              fecha_creacion: producto.fecha_creacion,
              estado: producto.estado,
              comprador_email: producto.comprador_email,
              productos: [],
              totalVenta: 0,
            };
          }
          this.ventasAgrupadasPorFecha[fecha][carroId].productos.push(producto);
          this.ventasAgrupadasPorFecha[fecha][carroId].totalVenta += producto.subtotal;
        }
      } else {
        console.warn('No se encontró un email en Native Storage.');
      }
    } catch (error) {
      console.error('Error al obtener el registro de ventas:', error);
    }
  }

  getFechasVentas(): string[] {
    return Object.keys(this.ventasAgrupadasPorFecha);
  }

  getCarrosPorFecha(fecha: string): any[] {
    return Object.values(this.ventasAgrupadasPorFecha[fecha]);
  }
}
