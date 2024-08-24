import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: 'inicio', icon: 'home' },
    { title: 'Productos', url: 'productos', icon: 'bag' },
    { title: 'Favoritos', url: '/folder/Favoritos', icon: 'heart' },
    { title: 'Mis Compras', url: '/folder/Mis Compras', icon: 'pricetags' },
    { title: 'Carrito', url: '/folder/Carrito', icon: 'cart' },
    { title: 'Mi Cuenta', url: '/folder/Mi Cuenta', icon: 'person' },
    { title: 'Salir de la cuenta', url: 'login', icon: 'log-out' },
  ];
  public labels = ['Promociones', 'Descuentos'];
  constructor() {}
}
