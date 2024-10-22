import { Component, OnInit } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service';
import { AlertController, NavController } from '@ionic/angular';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-mod-cuenta',
  templateUrl: './mod-cuenta.page.html',
  styleUrls: ['./mod-cuenta.page.scss'],
})
export class ModCuentaPage implements OnInit {

  isDisabled = true;
  // Variables del usuario
  usuario: any = {
    id: null,
    nombre: '',
    segundo_nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    nombre_empresa: '',
    descripcion_corta: '',
    direccion: '',
    foto_perfil: '',
    region_id: null,
    comuna_id: null,
  };

  imagen: any;
  selectedRegion: number | null = null;
  selectedComuna: number | null = null;
  regiones: any[] = [];
  comunas: any[] = [];
  direcciones: any[] = [];
  direccionSeleccionada: any = null; // Dirección seleccionada para modificar
  direccionAEliminar: any = null; // Propiedad para la dirección a eliminar
  id: any; // ID del usuario
  usuarioId: number=0; // Nueva variable para almacenar el ID del usuario

  nuevaDireccion: any = {
    region_id: null,
    comuna_id: null,
    direccion: ''
  };

  constructor(
    private dataBase: DataBaseService,
    public alertController: AlertController,
    private nativeStorage: NativeStorage,
    private router: Router,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarRegiones();
    this.cargarDirecciones();
  }

  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      const usuarioData = await this.dataBase.obtenerUsuarioPorEmail(email);
      if (usuarioData) {
        this.usuario = usuarioData;
        this.id = usuarioData.id;
        this.usuarioId = usuarioData.id; // Asignar el ID del usuario a la nueva variable
        this.selectedRegion = usuarioData.region_id;
        this.selectedComuna = usuarioData.comuna_id;
        if (this.selectedRegion !== null) {
          await this.cargarcomunas(this.selectedRegion);
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
    try {
      this.comunas = await this.dataBase.Comunas(regionId);
    } catch (error) {
      console.error('Error al cargar comunas:', error);
    }
  }

  async cargarDirecciones() {
    try {
      this.direcciones = await this.dataBase.obtenerDireccionesPorUsuario(this.usuario.id);
    } catch (error) {
      console.error('Error al cargar direcciones:', error);
    }
  }

  async cambiarDireccion() {
    if (this.direccionSeleccionada) {
      this.usuario.direccion = this.direccionSeleccionada.direccion;
      await this.guardarDireccionPreferida();
    }
  }

  async guardarDireccionPreferida() {
    try {
      const id = this.direccionSeleccionada?.id ?? 0;
      await this.dataBase.establecerDireccionPreferida(id, this.usuario.id);
      await this.presentAlert('Éxito', 'Dirección preferida actualizada.');
    } catch (error) {
      console.error('Error al guardar la dirección preferida:', error);
      await this.presentAlert('Error', 'No se pudo guardar la dirección preferida.');
    }
  }

  async agregarDireccion() {
    try {
      await this.dataBase.agregarDireccion(
        this.usuario.id,
        this.nuevaDireccion.comuna_id,
        this.nuevaDireccion.direccion
      );
      await this.cargarDirecciones();
      await this.presentAlert('Éxito', 'Dirección agregada correctamente.');
      this.nuevaDireccion = {
        region_id: null,
        comuna_id: null,
        direccion: ''
      }; // Reiniciar campos
    } catch (error) {
      console.error('Error al agregar la dirección:', error);
      await this.presentAlert('Error', 'No se pudo agregar la dirección.');
    }
  }
  async eliminarDireccion() {
    try {
      if (this.direccionAEliminar) {
        // Usa la nueva variable usuarioId para pasar el ID
        await this.dataBase.eliminarDireccion(this.direccionAEliminar.id, this.usuarioId); 
        await this.cargarDirecciones(); // Recarga las direcciones
        await this.presentAlert('Éxito', 'Dirección eliminada correctamente.');
        this.direccionAEliminar = null; // Reinicia la selección
      } else {
        await this.presentAlert('Error', 'Seleccione una dirección para eliminar.');
      }
    } catch (error) {
      console.error('Error al eliminar la dirección:', error);
      await this.presentAlert('Error', 'No se pudo eliminar la dirección.');
    }
  }

  
  async validarNombres(): Promise<boolean> {
    // Validaciones de nombres y apellidos
    if (!this.usuario.nombre || this.usuario.nombre.length < 2) {
      await this.presentAlert('Error', 'El primer nombre es obligatorio y debe tener al menos 2 caracteres.');
      return false;
    }

    if (!this.usuario.apellido_paterno || this.usuario.apellido_paterno.length < 2) {
      await this.presentAlert('Error', 'El apellido paterno es obligatorio y debe tener al menos 2 caracteres.');
      return false;
    }

    // Validar pNombre, sNombre, aPaterno, aMaterno
    const namePattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{2,40}$/;
    if (!namePattern.test(this.usuario.nombre) || !namePattern.test(this.usuario.apellido_paterno) ||
        (this.usuario.segundo_nombre && !namePattern.test(this.usuario.segundo_nombre)) ||
        (this.usuario.apellido_materno && !namePattern.test(this.usuario.apellido_materno))) {
      await this.presentAlert('Error', 'Los nombres y apellidos deben tener entre 2 y 40 carecteres y no contener números.');
      return false;
    }

    return true; // Todos los campos son válidos
  }

  async actualizarUsuario() {
    // Primero, valida los nombres antes de continuar
    const nombresValidos = await this.validarNombres();
    if (!nombresValidos) {
        return; // Si la validación falla, salimos del método
    }

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

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      });

      if (image && image.webPath) {
        this.usuario.foto_perfil = image.webPath;
        this.imagen = image.webPath;
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }
}