import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service'; 
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  carro: any; // Para almacenar el carro de compras
  detalles: any[] = []; // Para almacenar los detalles de los productos en el carro
  usuarioId: number = 0; // Almacena el ID del usuario
  totalCompra: number = 0; // Para almacenar el total de la compra

  constructor(
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    await this.obtenerUsuarioId();
    await this.cargarCarrito();
  }

  async vaciarCarrito() {
    if (this.detalles.length > 0) {
      // Iterar sobre una copia de `detalles` para evitar modificar la lista durante la eliminación
      for (const detalle of [...this.detalles]) {
        await this.eliminarProducto(detalle.producto_identificador);
      }
    } else {
      this.presentAlert('Carrito vacío', 'No hay productos en el carrito para eliminar.');
    }
  }

  async obtenerUsuarioId() {
    const email = await this.nativeStorage.getItem('userEmail');
    const usuario = await this.dbService.getUsuarioEmail(email);
    if (usuario) {
      this.usuarioId = usuario.id; // Asignar el ID del usuario
    } else {
      console.error('Usuario no encontrado');
    }
  }

  async cargarCarrito() {
    // Obtener el carro de compras del usuario
    this.carro = await this.dbService.getCarroCompra(this.usuarioId);
    if (this.carro) {
      this.detalles = await this.dbService.getDetallesCarro(this.carro.id);
      
      // Cargar precios de los productos
      await this.cargarPreciosProductos();
      
      this.calcularTotal();
    } else {
      console.log('No hay productos en el carrito.');
    }
  }

  async cargarPreciosProductos() {
    for (const detalle of this.detalles) {
      const producto = await this.dbService.getProducto(detalle.producto_id);
      if (producto) {
        detalle.nombre = producto.nombre;
        detalle.descripcion = producto.descripcion;
        detalle.precio = producto.precio;
        detalle.categoria = producto.categoria;
        detalle.subcategoria = producto.subcategoria;
        detalle.organico = producto.organico;
        detalle.proveedor_empresa = producto.proveedor_empresa;
        detalle.proveedor_region = producto.proveedor_region;
        detalle.subtotal = detalle.precio * detalle.cantidad; // Actualiza el subtotal

      }
    }
  }

  calcularTotal() {
    this.totalCompra = this.detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
  }

  async eliminarProducto(productoIdentificador: string) {
    // Obtener el detalle del producto antes de eliminarlo
    const detalle = this.detalles.find(d => d.producto_identificador === productoIdentificador);
    
    if (detalle) {
      // Eliminar el producto del carrito en la base de datos
      await this.dbService.eliminarProductoDelCarro(productoIdentificador, this.carro.id);
  
      // Reponer el stock del producto eliminado
      await this.dbService.reponerStock(detalle.producto_id, detalle.cantidad);
  
      // Actualizar la lista de detalles en la vista
      this.detalles = this.detalles.filter(d => d.producto_identificador !== productoIdentificador);
  
      // Recalcular el total de la compra
      this.calcularTotal();
  
    } else {
      console.error('Detalle del producto no encontrado');
    }
  }

  async confirmarCompra() {
    if (this.detalles.length === 0) {
      this.presentAlert('Carrito vacío', 'No hay productos en el carrito para confirmar la compra.');
      return;
    }

    const confirm = await this.presentConfirmationAlert();

    if (confirm) {
      await this.dbService.confirmarCompra(this.carro.id, this.totalCompra);
      this.presentAlert('Compra confirmada', 'Su compra ha sido confirmada.');
      this.detalles = []; // Limpiar el carrito
      this.totalCompra = 0; // Reiniciar el total
    }
  }

  async reducirStock(productoId: number, cantidad: number) {
    await this.dbService.reducirStock(productoId, cantidad);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmar Compra',
      message: '¿Está seguro de que desea confirmar la compra?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            return true;
          }
        }
      ]
    });
    await alert.present();

    const result = await alert.onDidDismiss();
    return result.role !== 'cancel'; // Devuelve true si el usuario confirma
  }
}