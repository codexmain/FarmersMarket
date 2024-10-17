import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service';

interface RegionesComunas {
  [key: string]: string[];
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  // Variables del formulario
  pNombre: string = '';
  sNombre: string = '';
  aPaterno: string = '';
  aMaterno: string = '';
  empresa: string = '';
  descripcion_corta: string = '';
  email: string = '';
  password: string = '';
  direccion: string = '';
  foto_perfil: string = '';
  estado_cuenta: string = 'activa';
  tipo_usuario_id: number = 1;

  selectedRegion: number | null = null;
  selectedComuna: number | null = null;
  regiones: any[] = [];
  comunas: any[] = [];
  
  emails: string[] = []; // Lista de emails existentes

  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private dataBase: DataBaseService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.emails = navigation.extras.state['emails'];
    }
  }

  ngOnInit() {
    this.cargarRegiones();
  }

  async cargarRegiones() {
    try {
      this.regiones = await this.dataBase.Regiones();
    } catch (error) {
      console.error('Error al cargar regiones:', error);
    }
  }

  async cargarcomunas(event: any) {
    this.selectedRegion = event.detail.value;
    if (this.selectedRegion) {
      try {
        this.comunas = await this.dataBase.Comunas(this.selectedRegion);
      } catch (error) {
        console.error('Error al cargar comunas:', error);
      }
    } else {
      this.comunas = [];
    }
    this.selectedComuna = null;
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async registrarse() {
    if (!this.validarFormulario()) return;

    const nuevoUsuario = {
      nombre: this.pNombre,
      segundo_nombre: this.sNombre || null,
      apellido_paterno: this.aPaterno,
      apellido_materno: this.aMaterno || null,
      email: this.email,
      contrasena: this.password,
      nombre_empresa: this.empresa || null,
      descripcion_corta: this.descripcion_corta || null,
      foto_perfil: this.foto_perfil || null,
      estado_cuenta: this.estado_cuenta,
      tipo_usuario_id: this.tipo_usuario_id,
      region_id: this.selectedRegion,
      comuna_id: this.selectedComuna,
      direccion: this.direccion,
    };

    const registroExitoso = await this.dataBase.registrarUsuario(nuevoUsuario);

    if (registroExitoso) {
      await this.presentAlert('Éxito', 'Usuario registrado exitosamente.');
      this.router.navigate(['/login']);
    } else {
      await this.presentAlert('Error', 'Hubo un problema al registrar el usuario.');
    }
  }

  validarFormulario(): boolean {
    const namePattern = /^[a-zA-Z\s]{2,}$/;
    const empresaPattern = /^[a-zA-Z0-9\s]{3,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const direccionPattern = /^[a-zA-Z0-9\s]+$/;

    if (!this.pNombre || !namePattern.test(this.pNombre)) {
      this.presentAlert('Error', 'El primer nombre es obligatorio y debe tener al menos 2 caracteres.');
      return false;
    }
    if (!this.aPaterno || !namePattern.test(this.aPaterno)) {
      this.presentAlert('Error', 'El apellido paterno es obligatorio y debe tener al menos 2 caracteres.');
      return false;
    }
    if (this.sNombre && !namePattern.test(this.sNombre)) {
      this.presentAlert('Error', 'El segundo nombre debe tener al menos 2 caracteres y no contener números.');
      return false;
    }
    if (this.aMaterno && !namePattern.test(this.aMaterno)) {
      this.presentAlert('Error', 'El apellido materno debe tener al menos 2 caracteres y no contener números.');
      return false;
    }
    if (this.empresa && !empresaPattern.test(this.empresa)) {
      this.presentAlert('Error', 'El nombre de la empresa debe tener al menos 3 caracteres.');
      return false;
    }
    if (!emailPattern.test(this.email) || this.emails.includes(this.email)) {
      this.presentAlert('Error', 'El email es obligatorio, debe tener un formato válido y no estar registrado.');
      return false;
    }
    if (!this.selectedRegion) {
      this.presentAlert('Error', 'La región es obligatoria.');
      return false;
    }
    if (!this.selectedComuna) {
      this.presentAlert('Error', 'La comuna es obligatoria.');
      return false;
    }
    if (!direccionPattern.test(this.direccion)) {
      this.presentAlert('Error', 'La dirección solo puede contener letras, números y espacios.');
      return false;
    }
    return this.validarPassword();
  }

  validarPassword(): boolean {
    if (this.password.length < 10 || this.password.length > 30) {
      this.presentAlert('Error', 'La contraseña debe tener entre 10 y 30 caracteres.');
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
      this.presentAlert('Error', 'La contraseña debe contener al menos un carácter especial.');
      return false;
    }
    if (/(\d)\1/.test(this.password) || /([a-zA-Z])\1/.test(this.password)) {
      this.presentAlert('Error', 'La contraseña no debe tener caracteres o números consecutivos repetidos.');
      return false;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(this.password)) {
      this.presentAlert('Error', 'La contraseña debe contener al menos dos letras mayúsculas.');
      return false;
    }
    return true;
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}