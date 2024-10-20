import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  vendedores: any[] = []; // Lista para almacenar los vendedores

  constructor(private db: DataBaseService, private router: Router) { }

  async ngOnInit() {
    this.vendedores = await this.db.getVendedores();
  }

  acceder(proveedorId: number) {
    this.router.navigate([`/pro-inicio`, { id: proveedorId }]);
  }
}