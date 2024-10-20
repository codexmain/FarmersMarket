import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-mod-proventas',
  templateUrl: './mod-proventas.page.html',
  styleUrls: ['./mod-proventas.page.scss'],
})
export class ModProventasPage implements OnInit {
  productoId: number = 0;
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;
  stock: number = 0;
  organico: number = 0; // 0 para no orgánico, 1 para orgánico
  subcategoriaId: number = 0;
  categorias: any[] = []; // Aquí puedes almacenar las categorías
  subcategorias: any[] = []; // Aquí puedes almacenar las subcategorías

  constructor(
    private route: ActivatedRoute,
    private db: DataBaseService,
    private alertController: AlertController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.productoId = params['productoId']; // Obtener productoId de los parámetros de la ruta
    });

    // Obtener los detalles del producto
    await this.obtenerProducto(this.productoId);

    // Obtener las categorías para el select
    this.categorias = await this.db.obtenerCategorias();
    // Obtener las subcategorías para el select
    this.subcategorias = await this.db.obtenerSubcategoriasPorCategoria(this.subcategoriaId);
  }

  async obtenerProducto(productoId: number) {
    try {
      const producto = await this.db.obtenerProducto(productoId); // Llama a la función del servicio
      // Llena los campos con los datos del producto
      this.nombre = producto.nombre;
      this.descripcion = producto.descripcion;
      this.precio = producto.precio;
      this.stock = producto.stock;
      this.organico = producto.organico;
      this.subcategoriaId = producto.subcategoria_id;
    } catch (error) {
      console.error('Error al obtener el producto', error);
      this.mostrarAlertaError();
    }
  }

  async guardarCambios() {
    try {
      await this.db.modProducto(this.productoId, this.nombre, this.descripcion, this.precio, this.stock, this.organico, this.subcategoriaId);
      console.log('Producto modificado con éxito');
      // Redirigir o mostrar un mensaje de éxito
      this.router.navigate(['/proventas']); // Redirigir a la página de productos
    } catch (error) {
      console.error('Error al modificar el producto', error);
      this.mostrarAlertaError();
    }
  }

  async mostrarAlertaError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se pudo modificar el producto.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async onCategoriaChange(categoriaId: number) {
    // Obtener las subcategorías para la categoría seleccionada
    this.subcategorias = await this.db.obtenerSubcategoriasPorCategoria(categoriaId);
  }
}