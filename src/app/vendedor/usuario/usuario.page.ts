import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  usuario: any;

  constructor(
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      if (email) {
        this.usuario = await this.dbService.getUsuarioByEmail(email);
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }

  irAModUsuario() {
    this.router.navigate(['/mod-usuario']);
  }
}