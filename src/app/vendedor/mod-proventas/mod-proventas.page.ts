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
  producto: any = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    organico: 0, // 0 = No orgánico, 1 = Orgánico
    categoriaId: 0, // Ajuste para almacenar id de la categoría
    subcategoriaId: 0, // Ajuste para almacenar id de la subcategoría
    foto_producto: ''
  };
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
      const producto = await this.db.getProductoselect(productoId);
      if (producto) {
        // Asignar los datos obtenidos al objeto `producto`
        this.producto = {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          organico: producto.organico,
          categoriaId: this.categorias.find(c => c.nombre === producto.categoria_nombre)?.id || 0,
          subcategoriaId: producto.subcategoria_id,
          foto_producto: producto.foto_producto
        };

        if (this.producto.categoriaId) {
          // Cargar subcategorías asociadas a la categoría del producto
          await this.cargarSubcategorias(this.producto.categoriaId);
        }
      }
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
    this.producto.categoriaId = categoriaId;
    await this.cargarSubcategorias(categoriaId);
  }

  validarPrecio(precio: number): boolean {
    return Number.isInteger(precio) && precio > 0 && precio <= 9999999;
  }

  validarStock(stock: number): boolean {
    return Number.isInteger(stock) && stock >= 0 && stock <= 99999;
  }

  async validarCampos(): Promise<boolean> {
    const { nombre, descripcion, precio, stock, organico, categoria_nombre, subcategoriaId } = this.producto;

    if (!nombre.trim()) {
      await this.mostrarAlertaError('El Nombre del Producto es un campo obligatorio.');
      return false;
    }
    if (nombre.length < 3 || nombre.length > 40) {
      await this.mostrarAlertaError('El Nombre del producto debe tener entre 3 y 40 caracteres.');
      return false;
    }
    if (descripcion && (descripcion.length < 10 || descripcion.length > 255)) {
      await this.mostrarAlertaError('La Descripción del producto debe tener entre 10 y 255 caracteres.');
      return false;
    }
    if (!precio || !this.validarPrecio(precio)) {
      await this.mostrarAlertaError('El Precio debe ser un número entero positivo y no debe superar los 7 dígitos.');
      return false;
    }
    if (stock === null || stock === undefined || !this.validarStock(stock)) {
      await this.mostrarAlertaError('El Stock debe ser un número entero entre 0 y 99999.');
      return false;
    }
    if (organico === null || organico === undefined) {
      await this.mostrarAlertaError('La procedencia del producto (Orgánico/No Orgánico) es un campo obligatorio.');
      return false;
    }
    if (categoria_nombre === '') {
      await this.mostrarAlertaError('La Categoría es un campo obligatorio.');
      return false;
    }
    if (subcategoriaId === 0) {
      await this.mostrarAlertaError('La Subcategoría es un campo obligatorio.');
      return false;
    }

    return true;
  }

  async guardarCambios() {
    if (await this.validarCampos()) {
      try {
        const { nombre, descripcion, precio, stock, organico, subcategoriaId, foto_producto } = this.producto;
        await this.db.modProducto(
          this.productoId,
          nombre,
          descripcion,
          precio,
          stock,
          organico,
          subcategoriaId,
          foto_producto
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
        this.producto.foto_producto = image.webPath; // Asignar la ruta de la foto
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

  clearProductName() {
    this.producto.nombre = '';
  }

  clearProductDesc() {
    this.producto.descripcion = '';
  }
}