import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { GeocodingService } from 'src/app/services/geocoding.service';
import { LocationValidationService } from 'src/app/services/location-validation.service';

@Component({
  selector: 'app-mod-cuenta',
  templateUrl: './mod-cuenta.page.html',
  styleUrls: ['./mod-cuenta.page.scss'],
})
export class ModCuentaPage implements OnInit {

  // Variables del usuario
  isDisabled = true;
  usuario: any = {
    nombre: '',
    segundo_nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '', // Email no editable
    nombre_empresa: '',
    descripcion_corta: '',
    direccion: '',
    foto_perfil: '',
    region_id: null, // ID de la región seleccionada
    comuna_id: null, // ID de la comuna seleccionada
  };
  imagen: any;
  datos: any;

  selectedRegion!: number;
  selectedComuna!: number;
  regiones: any[] = [];
  comunas: any[] = [];
  direcciones: any[] = []; // Lista de direcciones del usuario
  direccionSeleccionada: number | null = null;
  errorMessage: string = '';

  constructor(
    private dataBase: DataBaseService,
    public alertController: AlertController,
    private nativeStorage: NativeStorage,
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController,
    private geocodingService: GeocodingService,
    private locationValidationService: LocationValidationService
  ) { }

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarRegiones();  // Cargar regiones al inicializar
    this.cargarDirecciones();

  }


  async guardarDireccionPreferida() {
    try {
      const id = this.direccionSeleccionada ?? 0; // Valor por defecto si es null
      await this.dataBase.establecerDireccionPreferida(id, this.usuario.id);
      this.errorMessage = 'Éxito: Dirección preferida actualizada.';
    } catch (error) {
      console.error('Error al guardar la dirección preferida:', error);
      this.errorMessage = 'Error: No se pudo guardar la dirección preferida.';
    }
  }



  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      const usuarioData = await this.dataBase.getUsuarioByEmail(email);
      this.datos = await this.dataBase.getUsuarioByEmail(email);

      if (usuarioData) {
        this.usuario = usuarioData;

        // Cargar las regiones y asignar el valor correspondiente a region_id
        await this.cargarRegiones();

        // Buscar la región correspondiente y asignarla al usuario
        const regionEncontrada = this.regiones.find(region => region.nombre === this.datos.region);
        if (regionEncontrada) {
          this.usuario.region_id = regionEncontrada.id;
          this.selectedRegion = this.usuario.region_id;
          await this.cargarcomunas(this.selectedRegion);

          // Buscar la comuna correspondiente y asignarla al usuario
          const comunaEncontrada = this.comunas.find(comuna => comuna.nombre === this.datos.comuna);
          if (comunaEncontrada) {
            this.usuario.comuna_id = comunaEncontrada.id;
            this.selectedComuna = this.usuario.comuna_id;
          }
        }
      } else {
        this.errorMessage = 'Error: No se encontró el usuario.';
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.errorMessage = 'Error: Error al cargar los datos del usuario.';
    }
  }

  async cargarRegiones() {
    try {
      this.regiones = await this.dataBase.Regiones();
    } catch (error) {
      console.error('Error al cargar regiones:', error);
    }
  }

  async cargarcomunas(regionId: number) {
    if (regionId) {
      try {
        this.comunas = await this.dataBase.Comunas(regionId);
      } catch (error) {
        console.error('Error al cargar comunas:', error);
      }
    } else {
      this.comunas = [];
    }
  }

  async actualizarUsuario() {
    if (await this.validarCampos()) {  // Invocar validación de campos
      try {
        const actualizado = await this.dataBase.actualizarUsuarioPorEmail(this.usuario);
        if (actualizado) {
          this.errorMessage = 'Éxito: Usuario actualizado exitosamente.';
          this.irHaciaAtras();
        } else {
          this.errorMessage = 'Error: Hubo un problema al actualizar el usuario.';
        }
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        this.errorMessage = 'Error: Error al actualizar el usuario. Inténtalo más tarde.';
      }
    }
  }


  async validarCampos(): Promise<boolean> {
    const namePattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{2,40}$/;
    if (!this.usuario.nombre || this.usuario.nombre.length < 2) {
      this.errorMessage = 'Error: El primer nombre es obligatorio y debe tener al menos 2 caracteres.';
      return false;
    }
    if (!this.usuario.apellido_paterno || this.usuario.apellido_paterno.length < 2) {
      this.errorMessage = 'Error: El apellido paterno es obligatorio y debe tener al menos 2 caracteres.';
      return false;
    }
    if (!namePattern.test(this.usuario.nombre) || !namePattern.test(this.usuario.apellido_paterno) ||
      (this.usuario.segundo_nombre && !namePattern.test(this.usuario.segundo_nombre)) ||
      (this.usuario.apellido_materno && !namePattern.test(this.usuario.apellido_materno))) {
      this.errorMessage = 'Error: Los nombres y apellidos deben tener entre 2 y 40 caracteres y no contener números.';
      return false;
    }

    // Validar "Empresa" solo si contiene un valor
    const empresaPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s&]{3,30}$/;
    if (this.usuario.nombre_empresa && !empresaPattern.test(this.usuario.nombre_empresa)) {
      this.errorMessage = 'Error: El nombre de la empresa debe tener entre 3 y 30 caracteres y solo puede contener letras, números y espacios.';
      return false;
    }

    // Validar "Descripción Corta" solo si contiene un valor
    const descEmpresaPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,&%]{10,90}$/;
    if (this.usuario.descripcion_corta && !descEmpresaPattern.test(this.usuario.descripcion_corta)) {
      this.errorMessage = 'Error: La descripción de la empresa debe tener entre 10 y 90 caracteres y solo puede contener letras, números y espacios.';
      return false;
    }

    if (!this.usuario.region_id) {
      this.errorMessage = 'Error: La región es obligatoria.';
      return false;
    }
    if (!this.usuario.comuna_id) {
      this.errorMessage = 'Error: La comuna es obligatoria.';
      return false;
    }
    const direccionPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,]+$/;
    if (!direccionPattern.test(this.usuario.direccion)) {
      this.errorMessage = 'Error: La dirección solo puede contener letras, números y espacios.';
      return false;
    }

    return true;
  }

  irHaciaAtras() {
    this.navCtrl.pop();
  }




  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }


  async cargarDirecciones() {
    this.direcciones = await this.dataBase.obtenerDireccionesPorUsuario(this.usuario.id);
  }

  async seleccionarDireccionPreferida(id: number) {
    try {
      await this.dataBase.establecerDireccionPreferida(id, this.usuario.id);
      await this.cargarDirecciones(); // Recargar la lista
    } catch (error) {
      console.error('Error al seleccionar la dirección preferida:', error);
    }
  }


  async agregarDireccionPrompt() {
    const alert = await this.alertController.create({
      header: 'Nueva Dirección',
      inputs: [
        { name: 'direccion', type: 'text', placeholder: 'Ingrese la dirección' },
        { name: 'comuna_id', type: 'number', placeholder: 'ID de la comuna' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: async (data) => {
            await this.dataBase.agregarDireccion(this.usuario.id, data.comuna_id, data.direccion);
            await this.cargarDirecciones(); // Recargar la lista
          }
        }
      ]
    });
    await alert.present();
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });

    if (image && image.webPath) {
      this.usuario.foto_perfil = image.webPath; // Guardar en usuario.foto_perfil
      this.imagen = image.webPath; // Guardar en usuario.imagen
    }
  }

  clearPNombre() {
    this.usuario.nombre = '';
  }
  clearSNombre() {
    this.usuario.segundo_nombre = '';
  }

  clearAPaterno() {
    this.usuario.apellido_paterno = '';
  }
  clearAMaterno() {
    this.usuario.apellido_materno = '';

  }

  clearEmpresa() {
    this.usuario.nombre_empresa = '';

  }
  clearDescEmpresa() {
    this.usuario.descripcion_corta = '';

  }

  clearDirr() {
    this.usuario.direccion = '';

  }
  clearClave() {
    this.usuario.clave = '';
  }

  async useCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      if (this.usuario.comuna_id && this.locationValidationService.isWithinBoundary(this.usuario.comuna_id, lat, lng)) {
        this.geocodingService.reverseGeocode(lat, lng)
          .subscribe({
            next: (response) => {
              if (response.results.length > 0) {
                this.usuario.direccion = response.results[0].formatted_address;
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
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCh2hJLX2_-wDdUCk7BJ_ZWkYhLLo36nyY`);
    const data = await response.json();
    if (data.results.length > 0) {
      this.usuario.direccion = data.results[0].formatted_address;
    } else {
      this.presentToast('No se pudo obtener la dirección. Intenta nuevamente.');
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
}