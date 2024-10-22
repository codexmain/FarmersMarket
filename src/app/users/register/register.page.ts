import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, ToastController} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { LocationValidationService } from 'src/app/services/location-validation.service';


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
  imagen: any;

  selectedRegion: number | null = null;
  selectedComuna: number | null = null;
  regiones: any[] = [];
  comunas: any[] = [];
  
  emails: string[] = [];

  empresaObligatoria: boolean = false;
  descEmpresaObligatoria: boolean = false;
  

  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController,
    private dataBase: DataBaseService,
    private toastController: ToastController,
    private geocodingService: GeocodingService, 
    private locationValidationService: LocationValidationService
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

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  onFieldsChange() {
    if (this.empresa.length > 0 || this.descripcion_corta.length > 0) {
      this.empresaObligatoria = true;
      this.descEmpresaObligatoria = true;
      this.presentToast('Los campos "Empresa" y "Descripción Empresa" son ahora obligatorios y la cuenta será Proveedor/Vendedor.');
    } else {
      this.empresaObligatoria = false;
      this.descEmpresaObligatoria = false;
    }
    // Actualizar el tipo de usuario según los campos
    if (this.empresaObligatoria && this.descEmpresaObligatoria) {
      this.tipo_usuario_id = 2; // Proveedor/Vendedor
    } else {
      this.tipo_usuario_id = 1; // Usuario regular
    }
  }

  validarFormulario(): boolean {
    const namePattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{2,40}$/;
    const empresaPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s&]{3,30}$/;
    const descEmpresaPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,&%]{10,90}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const direccionPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,]+$/;

    if (!namePattern.test(this.pNombre) || !namePattern.test(this.aPaterno) ||
        (this.sNombre && !namePattern.test(this.sNombre)) ||
        (this.aMaterno && !namePattern.test(this.aMaterno))) {
      this.presentAlert('Error', 'Los nombres y apellidos deben tener entre 2 y 40 caracteres y no contener números.');
      return false;
    }

    if (this.empresa && !empresaPattern.test(this.empresa)) {
      this.presentAlert('Error', 'El nombre de la empresa debe tener entre 3 y 30 caracteres.');
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

    // Validar contraseña aquí
    if (this.password.length < 10 || this.password.length > 30) {
      this.presentAlert('Error', 'La contraseña debe tener entre 10 y 30 caracteres.');
      return false;
    }
    
    if (!/[!¡@#$%^&*(),.¿?":{}|<>=;'°]/.test(this.password)) {
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

    return true; // Todos los campos son válidos
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

  async takePicture() { 
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			resultType: CameraResultType.Uri
		});

		if (image && image.webPath) { 
			this.foto_perfil = image.webPath;
      this.imagen = image.webPath;
		}
	}

  
  async useCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;
  
      if (this.selectedComuna && this.locationValidationService.isWithinBoundary(this.selectedComuna, lat, lng)) {
        this.geocodingService.reverseGeocode(lat, lng)
          .subscribe({
            next: (response) => {
              if (response.results.length > 0) {
                this.direccion = response.results[0].formatted_address;
              } else {
                this.presentToast('No se pudo obtener la dirección. Intenta nuevamente.');
              }
            },
            error: (error) => {
              this.presentToast(`Error: ${error}`);
            }
          });
      } else {
        this.presentToast('Tu ubicación actual no coincide con la comuna seleccionada.');
      }
    } catch (error) {
      this.presentToast(`Error al obtener la ubicación: ${error}`);
    }
  }

  async reverseGeocode(lat: number, lng: number) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=APIDMAPS`);
    const data = await response.json();
    if (data.results.length > 0) {
      this.direccion = data.results[0].formatted_address;
    } else {
      this.presentToast('No se pudo obtener la dirección. Intenta nuevamente.');
    }
  }

  clearPNombre(){
    this.pNombre = '';
  }
  clearSNombre(){
    this.sNombre = '';
  }

  clearAPaterno(){
    this.aPaterno = '';
  }
  clearAMaterno(){
    this.aMaterno = '';

  }
  clearEmpresa(){
    this.empresa = '';

  }
  clearDescEmpresa(){
    this.descripcion_corta = '';

  }
  clearMail(){
    this.email = '';

  }
  clearClave(){
    this.password = '';

  }
  clearDirr(){
    this.direccion = '';

  }

}