import { Component } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.page.html',
  styleUrls: ['./agregar-producto.page.scss'],
})
export class AgregarProductoPage {
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;
  stock: number = 0;
  organico: boolean = false;
  foto_producto: string = '';
  subcategoria_id: number = 0;
  proveedor_email: string = '';
  nombreCategoria: string = '';
  nombreSubcategoria: string = '';
  categoria_id: number = 0;
  
  categorias: any[] = [];
  subcategorias: any[] = [];

  constructor(private databaseService: DataBaseService, private alertController: AlertController) {}

  ngOnInit() {
    this.obtenerCategorias();
  }

  async obtenerCategorias() {
    this.categorias = await this.databaseService.obtenerCategorias();
  }

  async obtenerSubcategorias(categoriaId: number) {
    this.subcategorias = await this.databaseService.obtenerSubcategorias(categoriaId);
  }

  async onAgregarProducto() {
    const producto = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      stock: this.stock,
      organico: this.organico ? 1 : 0,
      foto_producto: this.foto_producto,
      subcategoria_id: this.subcategoria_id,
      proveedor_email: this.proveedor_email
    };

    try {
      await this.databaseService.agregarProducto(producto);
      this.presentAlert('Éxito', 'Producto agregado correctamente');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo agregar el producto');
    }
  }

  async onAgregarCategoria() {
    const categoria = { nombre: this.nombreCategoria };
    try {
      await this.databaseService.agregarCategoria(categoria);
      this.presentAlert('Éxito', 'Categoría agregada correctamente');
      this.obtenerCategorias(); // Actualiza la lista de categorías
    } catch (error) {
      this.presentAlert('Error', 'No se pudo agregar la categoría');
    }
  }

  async onAgregarSubcategoria() {
    const subcategoria = { nombre: this.nombreSubcategoria, categoria_id: this.categoria_id };
    try {
      await this.databaseService.agregarSubcategoria(subcategoria);
      this.presentAlert('Éxito', 'Subcategoría agregada correctamente');
      this.obtenerSubcategorias(this.categoria_id); // Actualiza la lista de subcategorías
    } catch (error) {
      this.presentAlert('Error', 'No se pudo agregar la subcategoría');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}