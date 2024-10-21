import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-vendedor-page',
  templateUrl: './vendedor-page.page.html',
  styleUrls: ['./vendedor-page.page.scss'],
})
export class VendedorPagePage implements OnInit {
  userData: any;
  

  constructor(private route: Router,
    private nativeStorage: NativeStorage,
    private dbService: DataBaseService,) { 
    this.userData = this.route.getCurrentNavigation()?.extras?.state;
  }
  ngOnInit() {
    this.cargarDatosUsuario();
    
  }

  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail'); // Obtener el email del almacenamiento local

      if (email) {
        // Obtener datos del usuario desde la base de datos
        this.userData = await this.dbService.getUsuarioByEmail(email);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  navigateToUsuario() { //transferencia de array de correos a la parte de usuario
    let navigationextras: NavigationExtras = {
      state: this.userData
    };
    this.route.navigate(['/usuario'], navigationextras);
  }

  navigateToProventas() { //transferencia de array de correos a la parte de proventas
    let navigationextras: NavigationExtras = {
      state: this.userData
    };
    this.route.navigate(['/proventas'], navigationextras);
  }

  navigateToRegventas() { //transferencia de array de correos a la parte de regventas
    let navigationextras: NavigationExtras = {
      state: this.userData
    };
    this.route.navigate(['/regventas'], navigationextras);
  }

}
