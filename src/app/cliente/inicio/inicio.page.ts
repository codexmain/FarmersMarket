import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  vendedores: any[] = []; // Lista para almacenar los vendedores
  usuario: any;

  constructor(
    private db: DataBaseService,
    private router: Router,
    private nativeStorage: NativeStorage
  ) {}

  async ngOnInit() {
    // Cargar los vendedores y agregar la región correspondiente
    const vendedoresList = await this.db.getVendedores();
    this.vendedores = await Promise.all(
      vendedoresList.map(async (vendedor) => {
        const region = await this.db.obtenerRegionPorEmail(vendedor.email);
        return { ...vendedor, region: region || 'Región no encontrada' };
      })
    );
  }

  acceder(proveedorId: number) {
    this.router.navigate([`/pro-inicio`, proveedorId]);
  }

  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      if (email) {
        this.usuario = await this.db.getUsuarioByEmail(email);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }
}