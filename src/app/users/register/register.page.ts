import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service';
//usar para camara
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
interface RegionesComunas {
  //permite hacer la dependencia de comuna / region, para que sea interactivo cada vez que se cambie la region, se vean diferentes comunas
  [key: string]: string[];
}
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private DataBase: DataBaseService,
    //usar para camara
    private camera: Camera,
    private nativeStorage: NativeStorage
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      //recibir de login el array de correos
      this.emails = navigation.extras.state['emails'];
    }
  }
  emails: string[] = [];
  pNombre: string = '';
  sNombre: string = '';
  aPaterno: string = '';
  aMaterno: string = '';
  empresa: string = '';
  email: string = '';
  password: string = '';
  region: string = '';
  comuna: string = '';
  direccion: string = '';
  Imagen: string = '';
  //falta descripcion corta en el html ._.
  descripcion_Corta: string='';
  tipo_usuario_id: number = 1;

  selectedRegion: string = '';
  comunas: string[] = [];

  regionesComunas: RegionesComunas = {
    arica: ['Arica', 'Camarones'],
    tarapaca: ['Iquique', 'Alto Hospicio'],
    antofagasta: ['Antofagasta', 'Mejillones'],
    atacama: ['Copiapó', 'Caldera'],
    coquimbo: ['La Serena', 'Coquimbo'],
    valparaiso: ['Valparaíso', 'Viña del Mar'],
    metropolitana: ['Santiago', 'Puente Alto'],
    ohiggins: ['Rancagua', 'San Fernando'],
    maule: ['Talca', 'Curicó'],
    nuble: ['Chillán', 'San Carlos'],
    biobio: ['Concepción', 'Los Ángeles'],
    araucania: ['Temuco', 'Villarrica'],
    rios: ['Valdivia', 'La Unión'],
    lagos: ['Puerto Montt', 'Osorno'],
    aysen: ['Coyhaique', 'Puerto Aysén'],
    magallanes: ['Punta Arenas', 'Puerto Natales'],
  };

  // metodo para tomar la foto
  tomarFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        this.Imagen = 'data:image/jpeg;base64,' + imageData;
        this.nativeStorage
          .setItem('Imagen', { image: this.Imagen })
          .then(() => console.log('Imagen guardada en Native Storage'))
          .catch((error) => console.error('Error al guardar imagen', JSON.stringify(error)));
      },
      (err) => {
        console.error('Error al tomar foto', JSON.stringify(err));
      }
    );
  }

  onRegionChange(event: any) {
    this.selectedRegion = event.detail.value;
    this.comunas = this.regionesComunas[this.selectedRegion] || [];
    this.comuna = ''; // Resetear la comuna cuando se cambia la región
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  ngOnInit() {
    console.log(this.emails);
  }

  registrarUsuarios() {
    this.DataBase.registrarUsuarios(
      this.pNombre,
      this.sNombre,
      this.aPaterno,
      this.aMaterno,
      this.empresa,
      this.email,
      this.password,
      this.direccion,
      this.region,
      this.comuna,
      this.Imagen,
      this.tipo_usuario_id
    ); // ENviar Usuario al SQL
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
//comprobamos el email existe
async ComprobarEmail(): Promise<boolean> {
  const exists = await this.DataBase.emailExists(this.email);
  if (exists) {
    this.presentAlert('Error', 'El correo electrónico ya está registrado.');
    return false; 
  }
  return true;
}





  async registrarse() {
    const emailValid = await this.ComprobarEmail();
    if (!emailValid) {
      return; // email ya existe, no se puede registrar
    }
    //comprobar tipo usuario
    let tipo_usuario_id = 1; //cliente
    if (this.empresa && this.descripcion_Corta) {
      tipo_usuario_id = 2; // vendedor
    }

    // Validar pNombre

    if (!this.pNombre || this.pNombre.length < 2) {
      this.presentAlert(
        'Error',
        'El primer nombre es obligatorio y debe tener al menos 2 caracteres.'
      );
      return;
    }

    // Validar aPaterno
    if (!this.aPaterno || this.aPaterno.length < 2) {
      this.presentAlert(
        'Error',
        'El apellido paterno es obligatorio y debe tener al menos 2 caracteres.'
      );
      return;
    }

    // Validar email
    if (!this.email) {
      this.presentAlert('Error', 'El email es obligatorio.');
      return;
    }

    // Validar región
    if (!this.region) {
      this.presentAlert('Error', 'La región es obligatoria.');
      return;
    }

    // Validar comuna
    if (!this.comuna) {
      this.presentAlert('Error', 'La comuna es obligatoria.');
      return;
    }

    // Validar pNombre, sNombre, aPaterno, aMaterno
    const namePattern = /^[a-zA-Z\s]{2,}$/;
    if (
      !namePattern.test(this.pNombre) ||
      !namePattern.test(this.aPaterno) ||
      (this.sNombre && !namePattern.test(this.sNombre)) ||
      (this.aMaterno && !namePattern.test(this.aMaterno))
    ) {
      this.presentAlert(
        'Error',
        'Los nombres y apellidos deben tener al menos 2 caracteres y no contener números.'
      );
      return;
    }

    // Validar empresa
    const empresaPattern = /^[a-zA-Z0-9\s]{3,}$/;
    if (this.empresa && !empresaPattern.test(this.empresa)) {
      this.presentAlert(
        'Error',
        'El nombre de la empresa debe tener al menos 3 caracteres y solo puede contener letras, números y espacios.'
      );
      return;
    }

    // Validar email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.presentAlert('Error', 'El formato del email no es válido.');
      return;
    }
    if (this.emails.includes(this.email)) {
      this.presentAlert(
        'Error',
        'El email ingresado ya está asociado a otra cuenta.'
      );
      return;
    }

    // Validar dirección
    const direccionPattern = /^[a-zA-Z0-9\s]+$/;
    if (!direccionPattern.test(this.direccion)) {
      this.presentAlert(
        'Error',
        'La dirección solo puede contener letras, números y espacios.'
      );
      return;
    }

    // Validar contraseña
    if (this.password.length < 10 || this.password.length > 30) {
      this.presentAlert(
        'Error',
        'La contraseña debe tener entre 10 y 30 caracteres.'
      );
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
      this.presentAlert(
        'Error',
        'La contraseña debe contener al menos un carácter especial.'
      );
      return;
    }

    if (/(\d)\1/.test(this.password) || /([a-zA-Z])\1/.test(this.password)) {
      this.presentAlert(
        'Error',
        'La contraseña no debe contener caracteres o números consecutivos repetidos.'
      );
      return;
    }

    if (!/(?=.*[A-Z].*[A-Z])/.test(this.password)) {
      this.presentAlert(
        'Error',
        'La contraseña debe contener al menos dos letras mayúsculas.'
      );
      return;
    }

    // Si todas las validaciones pasan
    this.presentAlert('Éxito', 'Su cuenta se ha creado exitosamente.');
    this.registrarUsuarios();
    console.log('Formulario válido, proceder con el registro.');
    this.router.navigate(['/login']);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
