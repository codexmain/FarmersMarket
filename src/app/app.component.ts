import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  userEmail: string='';


  constructor(private router: Router, private nativeStorage: NativeStorage) {}

  ngOnInit() {
    this.updateUserEmail();
  }

  // Actualiza el correo desde Native Storage
  updateUserEmail() {
    this.nativeStorage.getItem('userEmail')
      .then((email) => {
        this.userEmail = email || 'Correo';
      })
      .catch(() => {
        this.userEmail = 'Correo'; // Valor predeterminado si no hay correo almacenado
      });
  }

  // Elimina el correo de Native Storage
  Salir() {
    this.nativeStorage.remove('userEmail')
      .then(() => {
        console.log('Correo eliminado de Native Storage');
        this.userEmail = 'Correo'; // Resetear el valor en la interfaz
      })
      .catch((error) => {
        console.error('Error eliminando el correo de Native Storage', error);
      });
  }
}
