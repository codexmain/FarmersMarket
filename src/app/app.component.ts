import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Socios', url: 'inicio', icon: 'home' },
    { title: 'Productos', url: 'productos', icon: 'bag' },
    { title: 'Mis Compras', url: 'compras', icon: 'pricetags' },
    { title: 'Carrito', url: 'carrito', icon: 'cart' },
    { title: 'Mi Cuenta', url: 'cuenta', icon: 'person' },
    { title: 'Salir de la cuenta', url: 'login', icon: 'log-out' },
  ];
}
