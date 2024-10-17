import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userEmail = '';

  constructor(private router: Router, private nativeStorage: NativeStorage) {}

  ngOnInit() {
    this.updateUserEmail();
  }

  // Obtener el correo de Native Storage
  async updateUserEmail() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      this.userEmail = email || 'Correo'; // Asignar el email o valor predeterminado
      console.log('Email obtenido:', this.userEmail);
    } catch (error) {
      console.error('Error al obtener el correo:', error);
      this.userEmail = 'Correo'; // Usar valor por defecto en caso de error
    }
  }

  // Método para salir y eliminar el email del almacenamiento
  async salir() {
    try {
      await this.nativeStorage.remove('userEmail');
      console.log('Correo eliminado de Native Storage');
      this.router.navigate(['/login'], { replaceUrl: true }); // Redirigir al login
    } catch (error) {
      console.error('Error al eliminar el correo:', error);
    }
  }
}
