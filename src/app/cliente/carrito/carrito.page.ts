import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
/*pendiente arreglo de carrito logica
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  cartId!: number;
  cartItems: CartItem[] = [];

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    this.initializeCart();
    this.loadCartItems();
  }

  async confirmarCompra() {
    const alert = await this.alertController.create({
      header: 'Compra exitosa',
      message: 'Tu compra ha sido realizada con éxito.(pendiente el metodo de pago)',
      buttons: ['OK']
    });

    await alert.present();
  }

  initializeCart() {
    this.dataBaseService.createNewCart().subscribe(cartId => {
      this.cartId = cartId;
    });
  }

  loadCartItems() {
    if (this.cartId) {
      this.dataBaseService.getCartItems(this.cartId).subscribe(items => {
        this.cartItems = items;
      });
    }
  }

  addToCart(productId: number) {
    const quantity = ;
    this.dataBaseService.addToCart(this.cartId, productId, quantity).subscribe(() => {
      this.loadCartItems(); 
    });
  }

  async confirmarCompra() {
    
    const alert = await this.alertController.create({
      header: 'Compra exitosa',
      message: 'Tu compra ha sido realizada con éxito.',
      buttons: ['OK']
    });
    
    await alert.present();
    
    
    this.initializeCart();
  }
}
*/