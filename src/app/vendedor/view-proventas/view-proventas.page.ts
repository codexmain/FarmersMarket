import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from '../../services/data-base.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-view-proventas',
  templateUrl: './view-proventas.page.html',
  styleUrls: ['./view-proventas.page.scss'],
})
export class ViewProventasPage implements OnInit {
  productoId: number = 0;
  producto: any = null; // Variable para almacenar los datos del producto

  constructor(
    private route: ActivatedRoute,
    private db: DataBaseService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.productoId = +this.route.snapshot.paramMap.get('productoId')!;
    await this.loadProductoDetails(); // Cargar detalles del producto al iniciar el componente
  }

  async loadProductoDetails() {
    try {
      this.producto = await this.db.getProductoselect(this.productoId);
      if (!this.producto) {
        const toast = await this.toastController.create({
          message: 'Producto no encontrado.',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
        this.router.navigate(['/']); // Redirigir si el producto no existe
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un problema al cargar el producto. Inténtalo de nuevo.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}