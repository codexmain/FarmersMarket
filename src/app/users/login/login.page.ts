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
    private nativeStorage: NativeStorage, //Se agrega NativeStorage
    private DataBase: DataBaseService //Llama a la base de datos y crea las tablas
  ) { }

  listaUsers: any = [
    //tipo usuario 1 es client, 2 es seller y el 3 admin
    {
      pfp: null, //profile picture (pfp), foto de perfil
      pNombre: 'Juan',
      sNombre: 'Carlos',
      aPaterno: 'Bodoque',
      aMaterno: null,
      correo: 'Jbodoque@gmail.com',
      password: 'titirilquen1',
      empresa: null,
      estadoUsuario: 'active',
      tipoUsuario: 1,
      region: 'metropolitana',
      comuna: 'Santiago',
      direccion: 'Avenida el Salto 1328',
    },

    {
      pfp: null, //profile picture (pfp), foto de perfil
      pNombre: 'Alvaro ',
      sNombre: 'Israel',
      aPaterno: 'Barrera',
      aMaterno: null,
      correo: 'alba.is@gmail.com',
      password: 'isal32@edcs',
      empresa: null,
      estadoUsuario: 'active',
      tipoUsuario: 1,
      region: 'metropolitana',
      comuna: 'Puente Alto',
      direccion: 'Pasaje puente asalto 132',
    },
    {
      pfp: null, //profile picture (pfp), foto de perfil
      pNombre: 'Maurico',
      sNombre: 'Javier',
      aPaterno: 'Paredes',
      aMaterno: 'Bugueño',
      correo: 'huevitoking@gmail.com',
      password: 'elmen@rquesta420',
      empresa: null,
      estadoUsuario: 'disabled',
      tipoUsuario: 1,
      region: 'valparaiso',
      comuna: 'Valparaiso',
      direccion: 'Avenida Principal 740',
    },
    {
      pfp: null, //profile picture (pfp), foto de perfil
      pNombre: 'Patricio',
      sNombre: '',
      aPaterno: 'Polanco',
      aMaterno: null,
      correo: 'huertopro@gmail.com',
      password: 'prtasdw=@pro',
      empresa: 'Huerto Pro',
      estadoUsuario: 'delete',
      tipoUsuario: 2,
      region: 'valparaiso',
      comuna: 'Valparaíso',
      direccion: 'Avenida el Chañar 430',
    },

    {
      pfp: null, //profile picture (pfp), foto de perfil
      pNombre: 'Albert',
      sNombre: 'Andrés',
      aPaterno: 'Mansilla',
      aMaterno: null,
      correo: 'tiuqueMansilla@gmail.com',
      password: 'alej;4nd@=ra',
      empresa: 'Frutales del Tiuque',
      estadoUsuario: 'active',
      tipoUsuario: 2,
      region: 'santiago',
      comuna: 'Puente Alto',
      direccion: 'Pasaje Aleatorio 379',
    },

    {
      pfp: null, //profile picture (pfp), foto de perfil
      pNombre: 'Ronald',
      sNombre: 'Morris',
      aPaterno: 'Cofre',
      aMaterno: null,
      correo: 'cochambre230@gmail.com',
      password: '123456',
      empresa: 'The 830 Farmer',
      estadoUsuario: 'active',
      tipoUsuario: 2,
      region: 'valparaiso',
      comuna: 'Valparaíso',
      direccion: 'Direccion aleatoria 430',
    },

    {
      pfp: null, //profile picture (pfp), foto de perfil
      pNombre: 'Ignacio',
      sNombre: 'Javier',
      aPaterno: 'Fuenzalida',
      aMaterno: 'Chandia',
      correo: 'i.fuenzalida@duocuc.cl',
      password: '123456',
      empresa: null,
      estadoUsuario: 'active',
      tipoUsuario: 3,
      region: 'metropolitana',
      comuna: 'Puente Alto',
      direccion: 'Avenida Direccion random 1429',
    },
  ];

  ngOnInit() { }

  async Logearse() {
    if (!this.email || !this.password) {
      await this.showAlert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (this.isCooldown) {
      await this.showAlert(
        'Error',
        'Demasiados intentos fallidos. Por favor, espera 20 segundos.'
      );
      return;
    }

    const user = this.listaUsers.find(
      (u: any) => u.correo === this.email && u.password === this.password
    );

    if (user) {
      if (user.estadoUsuario !== 'active') {
        await this.showAlert('Error', 'Tu cuenta no está activa.');
        return;
      }

      this.intentoLogin = 0; // Reiniciar intentos en caso de éxito
      const emails = this.listaUsers.map((u: any) => u.correo);

      let navigationextras: NavigationExtras = {
        state: {
          perfil: user.pfp,
          fstName: user.pNombre,
          sndName: user.sNombre,
          fstSurname: user.aPaterno,
          sndSurname: user.aMaterno,
          mail: user.correo,
          pwd: user.password,
          company: user.empresa,
          uStatus: user.estadoUsuario,
          userType: user.tipoUsuario,
          reg: user.region,
          com: user.comuna,
          loc: user.direccion,
          emails: emails,
        },
      };
      switch (user.tipoUsuario) {
        case 1:
          this.router.navigate(['/inicio'], navigationextras);
          break;
        case 2:
          this.router.navigate(['/vendedor-page'], navigationextras);
          break;
        case 3:
          this.router.navigate(['/admin-page'], navigationextras);
          break;
        default:
          await this.showAlert('Error', 'Tipo de usuario no reconocido.');
      }
    } else {
      this.intentoLogin++;
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
    const emails = this.listaUsers.map((u: any) => u.correo);
    console.log(emails);
    const modal = await this.modalController.create({
      component: RecuperarPasswordPage,
      componentProps: { emails: emails },
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
    const emails = this.listaUsers.map((u: any) => u.correo);

    let navigationextras = {
      state: { emails: emails },
    };
    this.router.navigate(['/register'], navigationextras);
  }


  Ingresar() {
    this.nativeStorage.setItem('userEmail', this.email)
      .then(() => {
        console.log('Mensaje: Email guardado');
        this.router.navigate(['productos'], { replaceUrl: true });//Impide volver con la flecha al login luego de ingresar 
      })
      .catch((e) => {
        console.error('Mensaje: Error guardando el email: ', JSON.stringify(e));
      });
  }


  Registrar() {
    this.router.navigate(['register'], { replaceUrl: true });
  }
}