import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  userEmail: string='';
  alertController: any;


  constructor(private router: Router, private nativeStorage: NativeStorage, private dataBaseService: DataBaseService) {}

  ngOnInit() {
    this.updateUserEmail();
  }

  // actualiza el correo desde Native Storage
  updateUserEmail() {
    this.nativeStorage.getItem('userEmail')
      .then((email) => {
        this.userEmail = email || 'Correo';
      })
      .catch(() => {
        this.userEmail = 'Correo'; // valor predeterminado si no hay correo almacenado
      });
  }

  // elimina el correo de Native Storage
  Salir() {
    this.nativeStorage.remove('userEmail')
      .then(() => {
        console.log('Correo eliminado de Native Storage');
        this.userEmail = 'Correo'; // resetear el valor en la interfaz
      })
      .catch((error) => {
        console.error('Error eliminando el correo de Native Storage', error);
      });
  }
  // alerta para confirmar el cierre de sesión y de carrito(implementar en salir() de arriba)
  /*
  async logout(userId: number, cartId: number) {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: 'Si cierras sesión, tu carrito de compras se eliminará. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.deleteCart(cartId);
            // Logic to log out the user
            console.log('User logged out');
          }
        }
      ]
    });

    await alert.present();
  }

  private deleteCart(cartId: number) {
    this.dataBaseService.deleteCart(cartId).subscribe(() => {
      console.log('Cart deleted');
    });
  }*/
}
