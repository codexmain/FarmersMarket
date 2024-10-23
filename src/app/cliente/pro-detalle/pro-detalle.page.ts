import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service'; 
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-pro-detalle',
  templateUrl: './pro-detalle.page.html',
  styleUrls: ['./pro-detalle.page.scss'],
})
export class ProDetallePage implements OnInit {
  producto: any = null; // Para almacenar los detalles del producto
  cantidad: number = 1; // Cantidad seleccionada por el usuario
  subtotal: number = 0; // Subtotal calculado
  usuarioId: number = 0; // Almacena el ID del usuario
  alertOpen: boolean = false; // Controla la visibilidad de la alerta

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage,
    private alertController: AlertController,
    private navCtrl: NavController // Para regresar a la página anterior
  ) {}

  async ngOnInit() {
    const productoId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    this.producto = await this.dbService.getProducto(productoId); // Función para obtener el producto
    await this.obtenerUsuarioId();
    this.actualizarSubtotal(); // Calcular el subtotal inicial
  }
  irHaciaAtras() {
    this.navCtrl.pop(); // Regresa a la página anterior
  }

  async obtenerUsuarioId() {
    const email = await this.nativeStorage.getItem('userEmail');
    const usuario = await this.dbService.getUsuarioEmail(email);
    this.usuarioId = usuario ? usuario.id : null; // Obtener el ID del usuario
  }

  actualizarSubtotal() {
    this.subtotal = this.producto.precio * this.cantidad; // Calcular subtotal
  }

  async agregarAlCarrito() {
    // Obtener o crear carro de compra
    const carro = await this.dbService.getCarroCompra(this.usuarioId);
    const carroId = carro ? carro.id : await this.crearCarro();

    // Agregar producto al carro
    await this.dbService.agregarProductoAlCarro(carroId, this.producto.id, this.cantidad, this.subtotal);
    
    // Mostrar alerta
    this.alertOpen = true;
  }

  cerrarAlerta() {
    this.alertOpen = false;
    this.irHaciaAtras();  // Llamamos la función al cerrar el alert
  }

  async crearCarro() {
    const result = await this.dbService.createCarroCompra(this.usuarioId);
    return result.insertId; // Retorna el ID del nuevo carro creado
  }
}