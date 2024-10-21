import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userEmail: string | null = null; // Inicializamos como null
  usuario: any = null; // Inicializamos sin datos

  constructor(
    private router: Router,
    private nativeStorage: NativeStorage,
    private dbService: DataBaseService
  ) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  // Función para cargar los datos del usuario
  async loadUserData() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      if (email) {
        this.userEmail = email;
  
        // Obtener datos completos del usuario usando el correo
        this.usuario = await this.dbService.getUsuarioByEmail(email);
        console.log('Datos del usuario obtenidos:', this.usuario); // Verifica aquí
      } else {
        console.log('No se encontró un email en NativeStorage.');
      }
    } catch (error) {
      console.error('Error al obtener el correo o datos del usuario:', error);
    }
  }

  async ionViewWillEnter() {
    // Recargar datos cada vez que la vista está a punto de entrar
    await this.loadUserData();
  }

  // Función para navegar a la página de cuenta
  navigateToCuenta() {
    const navigationExtras: NavigationExtras = {
      state: { usuario: this.usuario } // Enviamos el objeto usuario
    };
    this.router.navigate(['/cuenta'], navigationExtras);
  }

  // Función para navegar a la página de inicio
  navigateToInicio() {
    const navigationExtras: NavigationExtras = {
      state: { usuario: this.usuario } // Enviamos el objeto usuario
    };
    this.router.navigate(['/inicio'], navigationExtras);
  }

  // Función para navegar a la página de productos
  navigateToProductos() {
    const navigationExtras: NavigationExtras = {
      state: { usuario: this.usuario } // Enviamos el objeto usuario
    };
    this.router.navigate(['/productos'], navigationExtras);
  }

  // Función para navegar a la página de compras
  navigateToCompras() {
    const navigationExtras: NavigationExtras = {
      state: { usuario: this.usuario } // Enviamos el objeto usuario
    };
    this.router.navigate(['/compras'], navigationExtras);
  }

  // Función para navegar a la página de carrito
  navigateToCarrito() {
    const navigationExtras: NavigationExtras = {
      state: { usuario: this.usuario } // Enviamos el objeto usuario
    };
    this.router.navigate(['/carrito'], navigationExtras);
  }

  // Redirige al login
  async Salir() {
    const confirmacion = confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmacion) {
      await this.nativeStorage.clear(); // Limpiar el NativeStorage
      console.log('Datos del usuario eliminados de NativeStorage');
      this.userEmail = null; // Restablecer el email a null
      this.usuario = null; // Restablecer el objeto usuario a null
      this.router.navigate(['/login']); // Redirigir al login
    }
  }
}