import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { AlertController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-view-proventas',
  templateUrl: './view-proventas.page.html',
  styleUrls: ['./view-proventas.page.scss'],
})
export class ViewProventasPage implements OnInit {
  isDisabled = true;
  producto: any; // para la transferencia de argumentos de navParams

  proveedor_id!: number;
  nombre_producto: string = '';
  descripcion_producto: string = '';
  precio!: number;
  stock: number = 0;
  organico: number = 0; // default de organico en false
  categoria_id!: number;
  subcategoria_id: number | undefined;
  photo: string = ''; // Ruta de la foto

  arrayCmbProvedores: any = [];
  arrayCmbCategorias: any = [];
  arrayCmbSubcategorias: any = [];

  constructor(
    private route: ActivatedRoute,
    private bd: DataBaseService,
    private nativeStorage: NativeStorage,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Cargar producto desde Native Storage
    this.cargarProducto();

    // Cargar proveedores, categorías y subcategorías
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.cargarCombos();
      }
    });
  }

  async cargarProducto() {
    try {
      const productoId = Number(this.route.snapshot.paramMap.get('id')); // Obtener el ID del producto de la ruta

      // Aquí se obtiene el producto desde el Native Storage
      const productoData = await this.nativeStorage.getItem('producto_' + productoId);
      if (productoData) {
        this.producto = productoData;
        this.proveedor_id = this.producto.proveedor_id;
        this.nombre_producto = this.producto.nombre_producto;
        this.descripcion_producto = this.producto.descripcion_producto;
        this.precio = this.producto.precio;
        this.stock = this.producto.stock;
        this.organico = this.producto.organico;
        this.categoria_id = this.producto.categoria_id;
        this.subcategoria_id = this.producto.subcategoria_id;
        this.photo = this.producto.photo;
      } else {
        await this.presentAlert('Error', 'No se encontró el producto.');
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      await this.presentAlert('Error', 'Hubo un problema al cargar los datos del producto.');
    }
  }

  cargarCombos() {
    this.bd.fetchCmbProveedores().subscribe(res => {
      this.arrayCmbProvedores = res;
    });

    this.bd.fetchCategorias().subscribe(res => {
      this.arrayCmbCategorias = res;
    });

    this.bd.fetchCmbSubCategorias().subscribe(res => {
      this.arrayCmbSubcategorias = res;
    });
  }

  dismiss() {
    // Cierra el modal
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}