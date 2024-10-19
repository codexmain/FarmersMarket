import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { DataBaseService } from '../../services/data-base.service';
import { NavParams, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  //esto para traer la data de la parte principal

  isDisabled = true;
  usuario: any;

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


  constructor(private modalController: ModalController, private navParams: NavParams, private bd: DataBaseService, private toastController: ToastController, public alertController: AlertController) {
    // Obtener el usuario desde NavParams
    this.usuario = this.navParams.get('usuario'); //obtener todos los datos del usuario en especifico
  }

  ngOnInit() {
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

    // Actualiza la obligatoriedad de los campos al cargar
    this.onFieldsChange();

    //Carga de los combobox correspondientes
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        this.bd.fetchCmbTipUsuario().subscribe(res=>{
          this.arrayCmbTipoUsuario = res;
        })     
      }
    })
  }

  onFieldsChange() {
    // Lógica para determinar si los campos son obligatorios
    if (this.nombre_empresa.length > 0 || this.descripcion_corta.length > 0) {
      this.empresaObligatoria = true;
      this.descEmpresaObligatoria = true;
      this.presentToast('Los campos "Empresa" y "Descripción Empresa" son ahora obligatorios y la cuenta será Proveedor/Vendedor.');
    } else {
      this.empresaObligatoria = false;
      this.descEmpresaObligatoria = false;
    }

    // Actualizar el tipo de usuario
    this.tipo_usuario_id = (this.empresaObligatoria && this.descEmpresaObligatoria) ? 2 : 1;
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
                                    this.nombre_empresa, this.descripcion_corta, '', this.estado_cuenta, this.tipo_usuario_id);
  
      this.modalController.dismiss({ success: true });}


      async validateFields() {


        // Aquí van las validaciones
        if (!this.nombre || this.nombre.length < 2) {
          this.presentAlert('Error', 'El primer nombre es obligatorio y debe tener al menos 2 caracteres.');
          return false;
        }
    
        if (!this.apellido_paterno || this.apellido_paterno.length < 2) {
          this.presentAlert('Error', 'El apellido paterno es obligatorio y debe tener al menos 2 caracteres.');
          return false;
        }
        // Validar empresa y descEmpresa si se han marcado como obligatorios
        if ((this.empresaObligatoria && !this.nombre_empresa) || (this.descEmpresaObligatoria && !this.descripcion_corta)) {
          this.presentAlert('Error', 'Los campos "Empresa" y "Descripción Empresa" son obligatorios.');
          return false;
        }

          //validacion tipo usuario
        if (!this.tipo_usuario_id) {
          this.presentAlert('Error', 'El tipo de usuario es obligatorio.');
          return false;
        }

                //validacion tipo usuario
        if (!this.estado_cuenta) {
          this.presentAlert('Error', 'El Estado del usuario es obligatorio.');
          return false;
        }

            // Validar pNombre, sNombre, aPaterno, aMaterno
        const namePattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{2,}$/;
        if (!namePattern.test(this.nombre) || !namePattern.test(this.apellido_paterno) ||
            (this.segundo_nombre && !namePattern.test(this.segundo_nombre)) ||
            (this.apellido_materno && !namePattern.test(this.apellido_materno))) {
          this.presentAlert('Error', 'Los nombres y apellidos deben tener al menos 2 caracteres y no contener números.');
          return;
        }
        // Validar empresa
        const empresaPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s&]{3,}$/;
        if (this.nombre_empresa && !empresaPattern.test(this.nombre_empresa)) {
          this.presentAlert('Error', 'El nombre de la empresa debe tener al menos 3 caracteres y solo puede contener letras, números y espacios.');
          return;
        }

        const descEmpresaPattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s.,&%]{10,90}$/;
        if (this.descripcion_corta && !descEmpresaPattern.test(this.descripcion_corta)) {
          this.presentAlert('Error', 'La descripcion de la empresa debe estar en un rango de 10 a 90 caracteres y solo puede contener letras, números y espacios.');
          return false;
        }        
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(this.email)) {
          this.presentAlert('Error', 'El formato del email no es válido.');
          return false;
        }
    
        // Validar la existencia del correo solo si no es el mismo que el actual
        if (this.email !== this.usuario.email) {
          const correoExistente = await this.bd.verificarCorreoExistente(this.email);
          if (correoExistente) {
            this.presentAlert('Error', 'El correo ingresado ya está asociado a otra cuenta.');
            return false;
          }
        }
    
        // Agrega más validaciones según sea necesario
    
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
    
      dismiss() {
        this.modalController.dismiss();
      }
      
    }
    

