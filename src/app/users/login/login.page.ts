import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  MenuController,
} from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { RecuperarPasswordPage } from '../recuperar-password/recuperar-password.page';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  intentoLogin: number = 0;
  isCooldown: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private menu: MenuController,
    private dataBase: DataBaseService,
    private nativeStorage: NativeStorage
  ) {}

  ngOnInit() {}

  async Logearse() {
    // Validar campos vacíos
    if (!this.email || !this.password) {
      await this.showAlert('Error', 'Por favor, completa todos los campos.');
      return;
    }
  
    // Verificar cooldown
    if (this.isCooldown) {
      await this.showAlert(
        'Error',
        'Demasiados intentos fallidos. Por favor, espera 20 segundos.'
      );
      return;
    }
  
    try {
      const usuario = await this.dataBase.login(this.email, this.password);
  
      // Verificar si el usuario fue encontrado
      if (usuario) {
        if (usuario.estado_cuenta !== 'activa') {
          await this.showAlert('Error', 'Tu cuenta no está activa.');
          return;
        }
  
        // Validar que el email no esté vacío ni contenga solo espacios
        if (!this.email.trim()) {
          await this.showAlert('Error', 'El email no puede estar vacío o solo contener espacios.');
          return;
        }
  
        // Actualizar email en NativeStorage
        await this.actualizarEmail();
  
        const navigationExtras: NavigationExtras = {
          state: { ...usuario }, 
        };
  
        // Redirigir según el tipo de usuario
        switch (usuario.tipo_usuario_id) {
          case 1:
            this.router.navigate(['/productos'], navigationExtras);
            break;
          case 2:
            this.router.navigate(['/vendedor-page'], navigationExtras);
            break;
          case 3:
            this.router.navigate(['/admin-page'], navigationExtras);
            break;
          default:
            await this.showAlert('Error', 'Tipo de usuario no reconocido.');
        }
      } else {
        this.intentoLogin++;
        // Manejo de intentos fallidos
        if (this.intentoLogin >= 3) {
          this.isCooldown = true;
          setTimeout(() => {
            this.isCooldown = false;
            this.intentoLogin = 0;
          }, 20000); // 20 segundos de cooldown
          await this.showAlert(
            'Error',
            'Demasiados intentos fallidos. Por favor, espera 20 segundos.'
          );
        } else {
          await this.showAlert(
            'Error',
            'Correo electrónico o contraseña incorrectos.'
          );
        }
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', JSON.stringify(error));
      await this.showAlert('Error', 'Hubo un problema al iniciar sesión.');
    }
  }

  async actualizarEmail() {
    try {
      // Limpiar todo el NativeStorage
      await this.nativeStorage.clear().catch(() => {
        console.warn('No se pudo limpiar el NativeStorage.');
      });

      // Guardar el nuevo email
      await this.nativeStorage.setItem('userEmail', this.email);
      console.log('Email actualizado en NativeStorage:', this.email);
    } catch (error) {
      console.error('Error al actualizar el email:', error);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: RecuperarPasswordPage,
      componentProps: { emails: [] },
    });
    return await modal.present();
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  irRegister() {
    this.router.navigate(['/register']);
  }
}