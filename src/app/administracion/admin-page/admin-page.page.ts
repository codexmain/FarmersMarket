import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
})
export class AdminPagePage implements OnInit {
  pfp?: string; // Aquí puedes agregar el path de la imagen
  userData: any;
  emails: string[] = [];

  constructor(
    private router: Router,
    private nativeStorage: NativeStorage,
    private dbService: DataBaseService
  ) {
    this.userData = this.router.getCurrentNavigation()?.extras?.state;
  }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  async ionViewWillEnter() {
    await this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      if (email) {
        this.userData = await this.dbService.getUsuarioByEmail(email);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  navigateToUsers() {
    let navigationExtras: NavigationExtras = {
      state: {
        emails: this.emails,
      },
    };
    this.router.navigate(['/usuarios'], navigationExtras);
  }

  navigateToProducts() {
    this.router.navigate(['/items']);
  }

  navigateToCategories() {
    this.router.navigate(['/categorias']);
  }

  navigateToSubcategories() {
    this.router.navigate(['/subcategorias']);
  }

  navigateToAmonestaciones() {
    this.router.navigate(['/view-amonestaciones']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
