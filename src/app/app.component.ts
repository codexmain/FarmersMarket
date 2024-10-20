import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  ngOnInit() {
    this.updateUserEmailAndData();
  }

  // Actualiza el correo desde NativeStorage y obtiene los datos del usuario
  async updateUserEmailAndData() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      if (email) {
        this.userEmail = email;

        // Obtener datos completos del usuario usando el correo
        this.usuario = await this.dbService.getUsuarioByEmail(email);
        console.log('Datos del usuario obtenidos:', this.usuario);
      } else {
        console.log('No se encontró un email en NativeStorage.');
      }
    } catch (error) {
      console.error('Error al obtener el correo o datos del usuario:', error);
    }
  }

  // Elimina el correo del almacenamiento y redirige al login
  async Salir() {
    try {
      await this.nativeStorage.clear();
      console.log('Correo eliminado de NativeStorage');
      this.userEmail = null; // Limpiar el valor del correo
      this.usuario = null; // Limpiar los datos del usuario
      this.router.navigate(['/login']); // Redirigir al login
    } catch (error) {
      console.error('Error al eliminar el correo:', error);
    }
  }
}