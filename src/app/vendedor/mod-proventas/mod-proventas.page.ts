import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController, ToastController } from '@ionic/angular';

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
  organico: number = 0; // 0 = No orgánico, 1 = Orgánico
  categoriaId: number = 0;
  subcategoriaId: number = 0;
  foto_producto: string = ''; // Nueva propiedad para la foto
  imagen: any;

  categorias: Array<{ id: number, nombre: string }> = [];
  subcategorias: Array<{ id: number, nombre: string }> = [];

  constructor(
    private route: ActivatedRoute,
    private db: DataBaseService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.productoId = +this.route.snapshot.paramMap.get('productoId')!;
    await this.cargarCategorias();
    await this.obtenerProducto(this.productoId);
  }

  async cargarCategorias() {
    try {
      this.categorias = await this.db.obtenerCategorias();
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      this.mostrarAlertaError('No se pudieron cargar las categorías.');
    }
  }

  async obtenerProducto(productoId: number) {
    try {
      const producto = await this.db.obtenerProducto(productoId);
      this.nombre = producto.nombre;
      this.descripcion = producto.descripcion;
      this.precio = producto.precio;
      this.stock = producto.stock;
      this.organico = producto.organico;
      this.categoriaId = producto.categoria_id;
      this.subcategoriaId = producto.subcategoria_id;
      this.foto_producto = producto.foto_producto; // Asignar la foto del producto
      await this.cargarSubcategorias(this.categoriaId);
    } catch (error) {
      console.error('Error al obtener el producto:', error);
      this.mostrarAlertaError('No se pudo cargar el producto.');
    }
  }

  async cargarSubcategorias(categoriaId: number) {
    try {
      this.subcategorias = await this.db.obtenerSubcategoriasPorCategoria(categoriaId);
    } catch (error) {
      console.error('Error al cargar subcategorías:', error);
      this.mostrarAlertaError('No se pudieron cargar las subcategorías.');
    }
  }

  async onCategoriaChange(categoriaId: number) {
    this.categoriaId = categoriaId;
    await this.cargarSubcategorias(categoriaId);
  }

      // Validar precio
    validarPrecio(precio: number): boolean {
      const esEntero = Number.isInteger(precio);
      const esValido = esEntero && precio > 0 && precio <= 9999999;
      return esValido;
    }
  
    // Validar stock
    validarStock(stock: number): boolean {
      const esEntero = Number.isInteger(stock);
      const esValido = esEntero && stock >= 0 && stock <= 99999; // Longitud de cinco, mayor o igual a cero
      return esValido;
    }



    async validarCampos(): Promise<boolean> {

      if (!this.nombre.trim()) {
        await this.mostrarAlertaError('El Nombre del Producto es un campo obligatorio.');
        return false;
      }
      if (this.nombre.length < 3 || this.nombre.length > 40) {
        await this.mostrarAlertaError('El Nombre del producto debe tener entre 3 y 40 caracteres.');
        return false;
      }

      if (this.descripcion && 
        (this.descripcion.length < 10 || this.descripcion.length > 255)) {
         this.mostrarAlertaError('La Descripción del producto debe tener entre 10 y 255 caracteres.');
         return false;
      }

      if (!this.precio) {
        await this.mostrarAlertaError('El Precio del producto es un campo obligatorio.');
        return false;
      }

      
      if (!this.validarPrecio(this.precio)) {
        await this.mostrarAlertaError('El Precio del producto debe ser un número entero mayor a 0 y no debe superar los 7 dígitos.');
        return false;
      }

      if (this.stock === null || this.stock === undefined) {
        await this.mostrarAlertaError('El Stock/Existencias es un campo obligatorio.');
        return false;
      }

      if (!this.validarStock(this.stock)) {
        await this.mostrarAlertaError('El Stock del producto debe ser un número entero mayor o igual a cero y no debe superar los 5 dígitos.');
        return false;
      }

      if (this.organico === null || this.organico === undefined) {
        await this.mostrarAlertaError('La procedencia del producto (Orgánico/No Orgánico) es un campo obligatorio.');
        return false;
      }
  
      if (this.categoriaId === 0) {
        await this.mostrarAlertaError('La Categoría es un campo obligatorio.');
        return false;
      }
  
      if (this.subcategoriaId === 0) {
        await this.mostrarAlertaError('La Subcategoría es un campo obligatorio.');
        return false;
      }

      return true; // Todos los campos son válidos
    };


  async guardarCambios() {
    if (await this.validarCampos()) {
      try {
        await this.db.modProducto(
          this.productoId,
          this.nombre,
          this.descripcion,
          this.precio,
          this.stock,
          this.organico,
          this.subcategoriaId,
          this.foto_producto
        );
        this.mostrarToast('Producto modificado exitosamente.', 'success');
        this.router.navigate(['/proventas']);
      } catch (error) {
        console.error('Error al modificar el producto:', error);
        this.mostrarAlertaError('No se pudo modificar el producto.');
      }
    }
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });

      if (image && image.webPath) {
        this.foto_producto = image.webPath; // Asignar la ruta de la foto
        this.imagen = image.webPath;
        this.mostrarToast('Foto tomada exitosamente.', 'success');
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.mostrarAlertaError('No se pudo tomar la foto.');
    }
  }

  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
    });
    await toast.present();
  }

  clearProductName(){
    this.nombre = '';
  }

  clearProductDesc(){
    this.descripcion = '';
  }

  
}