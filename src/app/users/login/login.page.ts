import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string='';  //estos vienen de la etiquete [(ngModel)]="email" y [(ngModel)]="password" del HTML
  password: string='';
  intentoLogin: number = 0; //esto es para limitar intentos en el inicio de sesion
  isCooldown: boolean = false; // esto es para dar un tiempo de espera despues de fallar los intentos determinados


  constructor(private router: Router, private alertController: AlertController, ) { }



  listaUsers: any = [  //tipo usuario 1 es client, 2 es seller y el 3 admin
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
      comuna: 'Satiago',
      direccion: 'Avenida el Salto 1328'
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
      direccion: 'Pasaje puente asalto 132'
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
      direccion: 'Avenida Principal 740'

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
      direccion: 'Avenida el Chañar 430'

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
      direccion: 'Pasaje Aleatorio 379'

    },

    {
      pfp: null, //profile picture (pfp), foto de perfil
      pNombre: 'Ronald',
      sNombre: 'Morris',
      aPaterno: 'Cofre',
      aMaterno: null,
      correo: '',
      password: '',
      empresa: 'The 830 Farmer',
      estadoUsuario: 'active',
      tipoUsuario: 2,
      region: 'valparaiso',
      comuna: 'Valparaíso',
      direccion: 'Direccion aleatoria 430'

    },

    {
      pfp: null, //profile picture (pfp), foto de perfil
      pNombre: 'Ignacio',
      sNombre: 'Javier',
      aPaterno: 'Fuenzalida',
      aMaterno: 'Chandia',
      correo: 'i.fuenzalida@gmail.com',
      password: 'Jfuenchan4030',
      empresa: null,
      estadoUsuario: 'active',
      tipoUsuario: 3,
      region: 'metropolitana',
      comuna: 'Puente Alto',
      direccion: 'Avenida Direccion random 1429'

    },


  ];
  ngOnInit() {
  }

  async Logearse() {
    if (!this.email || !this.password) {
      await this.showAlert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (this.isCooldown) {
      await this.showAlert('Error', 'Demasiados intentos fallidos. Por favor, espera 20 segundos.');
      return;
    }

    const user = this.listaUsers.find((u: any) => u.correo === this.email && u.password === this.password);

    if (user) {
      if (user.estadoUsuario !== 'active') {
        await this.showAlert('Error', 'Tu cuenta no está activa.');
        return;
      }

      this.intentoLogin = 0; // Reiniciar intentos en caso de éxito
      switch (user.tipoUsuario) {
        case 1:
          this.router.navigate(['/inicio']);
          break;
        case 2:
          this.router.navigate(['/nose-page']); //esta este pendiente pq este lo tas haciendo tú nacho
          break;
        case 3:
          this.router.navigate(['/admin-page']);
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
        await this.showAlert('Error', 'Demasiados intentos fallidos. Por favor, espera 20 segundos.');
      } else {
        await this.showAlert('Error', 'Correo electrónico o contraseña incorrectos.');
      }
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  



}

