import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/folder/Inicio', icon: 'home' },
    { title: 'Categorias', url: '/folder/Categorias', icon: 'pricetag' },
    { title: 'Productos', url: '/folder/Productos', icon: 'pricetags' },
    { title: 'Carrito', url: '/folder/Carrito', icon: 'cart' },
    { title: 'Mis Datos', url: '/folder/Mis Datos', icon: 'person' },
    { title: 'Login', url: '/folder/Login', icon: 'log-in' },
  ];
  public labels = ['Promociones', 'Descuentos'];
  constructor() {}
}
