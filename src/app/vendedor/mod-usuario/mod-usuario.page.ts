import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-mod-usuario',
  templateUrl: './mod-usuario.page.html',
  styleUrls: ['./mod-usuario.page.scss'],
})
export class ModUsuarioPage implements OnInit {
  // Variables del usuario
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

  selectedRegion: number | null = null;
  selectedComuna: number | null = null;
  regiones: any[] = [];
  comunas: any[] = [];
  direcciones: any[] = []; // Lista de direcciones del usuario
  direccionSeleccionada: number | null = null; // 

  constructor(
    private dataBase: DataBaseService,
    public alertController: AlertController,
    private nativeStorage: NativeStorage,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarRegiones();  // Cargar regiones al inicializar
    this.cargarDirecciones();
    
  }

  async guardarDireccionPreferida() {
    try {
      const id = this.direccionSeleccionada ?? 0; // Valor por defecto si es null
      await this.dataBase.establecerDireccionPreferida(id, this.usuario.id);
      await this.presentAlert('Éxito', 'Dirección preferida actualizada.');
    } catch (error) {
      console.error('Error al guardar la dirección preferida:', error);
      await this.presentAlert('Error', 'No se pudo guardar la dirección preferida.');
    }
  }

 

  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      const usuarioData = await this.dataBase.obtenerUsuarioPorEmail(email);
      
      if (usuarioData) {
        this.usuario = usuarioData;
        this.selectedRegion = usuarioData.region_id; // Asignar la región seleccionada
        this.selectedComuna = usuarioData.comuna_id; // Asignar la comuna seleccionada

        // Llamar a cargarcomunas solo si selectedRegion no es null
        if (this.selectedRegion !== null) {
          await this.cargarcomunas(this.selectedRegion); // Cargar comunas de la región seleccionada
        }
      } else {
        await this.presentAlert('Error', 'No se encontró el usuario.');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      await this.presentAlert('Error', 'Error al cargar los datos del usuario.');
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
    try {
      const actualizado = await this.dataBase.actualizarUsuarioPorEmail(this.usuario);
      if (actualizado) {
        await this.presentAlert('Éxito', 'Usuario actualizado exitosamente.');
        this.irHaciaAtras();
      } else {
        await this.presentAlert('Error', 'Hubo un problema al actualizar el usuario.');
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      await this.presentAlert('Error', 'Error al actualizar el usuario. Inténtalo más tarde.');
    }
  }

  irHaciaAtras() {
    this.navCtrl.pop(); // Regresa a la página anterior
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



}