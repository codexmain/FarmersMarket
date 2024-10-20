import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service'; 
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  usuario: any;

  constructor(
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage,
    private router: Router // Inyecta Router
  ) {}

  async ngOnInit() {
    // Obtener email del usuario desde Native Storage
    const email = await this.nativeStorage.getItem('userEmail');

    if (email) {
      // Obtener datos del usuario desde la base de datos
      this.usuario = await this.dbService.getUsuarioByEmail(email);
    }
  }

  irAModCuenta() {
    // Redirige a la página de modificación de cuenta
    this.router.navigate(['/mod-cuenta']);
  }
}