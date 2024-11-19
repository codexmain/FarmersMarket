import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController, AlertController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.page.html',
  styleUrls: ['./modificar-usuario.page.scss'],
})
export class ModificarUsuarioPage implements OnInit {
  //esto para traer la data de la parte principal

  isDisabled = true;
  isDisabledEstado = true;
  usuario: any;
  usuarioActual: any; // Para almacenar el usuario actual del native storage

  //cosas del formulario
  nombre: string = '';
  apellido_paterno: string = '';
  segundo_nombre: string = '';
  apellido_materno: string = '';
  email: string = '';
  contrasena: string = '';
  nombre_empresa: string = '';
  descripcion_corta: string = '';
  estado_cuenta: string = ''
  tipo_usuario_id!: number;
  empresaObligatoria: boolean = false;
  descEmpresaObligatoria: boolean = false;

  arrayCmbTipoUsuario: any = [
    {
      id: '',
      descripcion: '',
    }
  ]
  foto_perfil: string='';
  imagen: any;


  constructor(private modalController: ModalController, private navParams: NavParams, private bd: DataBaseService, private toastController: ToastController, public alertController: AlertController, private nativeStorage: NativeStorage) {
    // Obtener el usuario desde NavParams
    this.usuario = this.navParams.get('usuario'); //obtener todos los datos del usuario en especifico
  }

  ngOnInit() {
    //Carga de los combobox correspondientes
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        this.bd.fetchCmbTipUsuario().subscribe(res=>{
          this.arrayCmbTipoUsuario = res;
        })     
      }
    });
    this.cargarDatosUsuarioActual(); // Cargar los datos del usuario actual al iniciar
    //carga de los datos al formulario
    this.nombre = this.usuario.nombre;
    this.apellido_paterno = this.usuario.apellido_paterno;
    this.segundo_nombre = this.usuario.segundo_nombre;
    this.apellido_materno = this.usuario.apellido_materno;
    this.email = this.usuario.email;
    this.contrasena = this.usuario.contrasena;
    this.nombre_empresa = this.usuario.nombre_empresa;
    this.descripcion_corta = this.usuario.descripcion_corta;
    this.estado_cuenta = this.usuario.estado_cuenta;
    this.tipo_usuario_id = this.usuario.tipo_usuario_id;
    this.foto_perfil = this.usuario.foto_perfil;

    



    // Desactiva el campo estado_cuenta si el usuario está modificando su propia cuenta
    if (this.usuarioActual && this.usuario.id === this.usuarioActual.id) {
      this.isDisabledEstado = true; // Desactivar el campo
    } else {
      this.isDisabledEstado = false; // Activar el campo
    }
  }

  async cargarDatosUsuarioActual() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      if (email) {
        this.usuarioActual = await this.bd.getUsuarioByEmail(email); // Obtener los datos del usuario actual
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario actual:', error);
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


  async modificarUser() {
    // Realiza validaciones
    const isValid = await this.validateFields();
    if (!isValid) {
      return; // Si hay errores, salimos
    }
      // Procede a actualizar el usuario en la base de datos
      await this.bd.modificarUsuario(this.usuario.id, this.nombre,
                                    this.segundo_nombre, this.apellido_paterno, this.apellido_materno, this.email,
                                    this.nombre_empresa, this.descripcion_corta, this.foto_perfil, this.estado_cuenta, this.tipo_usuario_id);
  
      this.modalController.dismiss({ success: true });}


      async validateFields() {

        if (!this.estado_cuenta) {
          this.presentAlert('Error', 'El Estado del usuario es obligatorio.');
          return false;
        }
    
        return true; // Si todas las validaciones pasan
      }

      async presentAlert(header: string, message: string) {
        const alert = await this.alertController.create({
          header,
          message,
          buttons: ['OK']
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
      this.foto_perfil = image.webPath;
      this.imagen = image.webPath;
    }
  }
    
      dismiss() {
        this.modalController.dismiss();
      }

      
    }
    



