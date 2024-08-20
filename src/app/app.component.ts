import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/folder/Inicio', icon: 'home' },
    { title: 'Productos', url: '/folder/Productos', icon: 'bag' },
    { title: 'Favoritos', url: '/folder/Favoritos', icon: 'heart' },
    { title: 'Mis Compras', url: '/folder/Mis Compras', icon: 'pricetags' },
    { title: 'Carrito', url: '/folder/Carrito', icon: 'cart' },
    { title: 'Mi Cuenta', url: '/folder/Mi Cuenta', icon: 'person' },
    { title: 'Login', url: 'login', icon: 'log-in' },
  ];
  public labels = ['Promociones', 'Descuentos'];
  constructor() {}
}
