import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, NavParams, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service'



@Component({
  selector: 'app-add-usuarios',
  templateUrl: './add-usuarios.page.html',
  styleUrls: ['./add-usuarios.page.scss'],
})
export class AddUsuariosPage implements OnInit {
  arrayCmbRegiones: any = [
    {
      id: '',
      nombre: ''
    }
  ]

  arrayCmbComunas: any = [
    {
      id: '',
      nombre: '',
    }
  ]

  arrayCmbTipoUsuario: any = [
    {
      id: '',
      descripcion: '',
    }
  ]


  pNombre: string = '';
  sNombre: string = '';
  aPaterno: string = '';
  aMaterno: string = '';
  email: string = '';
  password: string = '';
  empresa: string = '';
  descEmpresa: string = '';

  estadoUsuario: string ='activo'; //estado del usuario por defecto
  tipoUsuario: number = 1 ; //tipo de usuario por defecto
  region!: number;
  comuna: number | undefined;
  direccion: string = '';
  empresaObligatoria: boolean = false;
  descEmpresaObligatoria: boolean = false;

  constructor(private bd: DataBaseService, private toastController: ToastController, private modalController: ModalController, private menu: MenuController, private route: ActivatedRoute, private router: Router, public alertController: AlertController, private navParams: NavParams) { 

  }



  
  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchCmbRegiones().subscribe(res=>{
          this.arrayCmbRegiones = res;
        })

        this.bd.fetchCmbTipUsuario().subscribe(res=>{
          this.arrayCmbTipoUsuario = res;
        })     
      }
    })
  }

  onRegionChange(event: any) {
    this.region = event.detail.value;
    if (this.region) {
      this.bd.seleccionarCmbComunas(this.region).then(() => {
        this.bd.fetchCmbComuna().subscribe(res => {
          this.arrayCmbComunas = res; // Asigna las comunas obtenidas
        });
      });
    } else {
      // Reiniciar la lista de comunas a la estructura inicial
      this.arrayCmbComunas = [
        {
          id: '',
          nombre: '',
        }
      ];
      this.comuna = undefined; // Reiniciar comuna seleccionada
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
    if (this.empresa.length > 0 || this.descEmpresa.length > 0) {
      this.empresaObligatoria = true;
      this.descEmpresaObligatoria = true;
      this.presentToast('Los campos "Empresa" y "Descripción Empresa" son ahora obligatorios y la cuenta será Proveedor/Vendedor.');
    } else {
      this.empresaObligatoria = false;
      this.descEmpresaObligatoria = false;
    }
  
    // Actualizar el tipo de usuario basado en la obligación de los campos
    this.tipoUsuario = (this.empresaObligatoria && this.descEmpresaObligatoria) ? 2 : 1;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async agregarUsuario() {

  // Validar pNombre

  if (!this.pNombre || this.pNombre.length < 2) {
    this.presentAlert('Error', 'El primer nombre es obligatorio y debe tener al menos 2 caracteres.');
    return;
  }

  // Validar aPaterno
  if (!this.aPaterno || this.aPaterno.length < 2) {
    this.presentAlert('Error', 'El apellido paterno es obligatorio y debe tener al menos 2 caracteres.');
    return;
  }
  
  // Validar empresa y descEmpresa si se han marcado como obligatorios
  if ((this.empresaObligatoria && !this.empresa) || (this.descEmpresaObligatoria && !this.descEmpresa)) {
    this.presentAlert('Error', 'Los campos "Empresa" y "Descripción Empresa" son obligatorios.');
    return;
  }

  //validacion tipo usuario
  if (!this.tipoUsuario) {
    this.presentAlert('Error', 'El tipo de usuario es obligatorio.');
    return;
  }

  //validacion tipo usuario
  if (!this.estadoUsuario) {
    this.presentAlert('Error', 'El Estado del usuario es obligatorio.');
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
    if (!namePattern.test(this.pNombre) || !namePattern.test(this.aPaterno) ||
        (this.sNombre && !namePattern.test(this.sNombre)) ||
        (this.aMaterno && !namePattern.test(this.aMaterno))) {
      this.presentAlert('Error', 'Los nombres y apellidos deben tener al menos 2 caracteres y no contener números.');
      return;
    }
 


    // Validar empresa
    const empresaPattern = /^[a-zA-Z0-9\s]{3,}$/;
    if (this.empresa && !empresaPattern.test(this.empresa)) {
      this.presentAlert('Error', 'El nombre de la empresa debe tener al menos 3 caracteres y solo puede contener letras, números y espacios.');
      return;
    }

    const descEmpresaPattern = /^[a-zA-Z0-9\s]{10,90}$/;
    if (this.descEmpresa && !descEmpresaPattern.test(this.descEmpresa)) {
      this.presentAlert('Error', 'La descripcion de la empresa debe estar en un rango de 10 a 90 caracteres y solo puede contener letras, números y espacios.');
      return;
    }


    // Validar email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.presentAlert('Error', 'El formato del email no es válido.');
      return;
    }
    // Validar si el correo ya existe
    const correoExistente = await this.bd.verificarCorreoExistente(this.email);
    if (correoExistente) {
      this.presentAlert('Error', 'El correo ingresado ya está asociado a otra cuenta.');
      return;
    }


    // Validar dirección
    const direccionPattern = /^[a-zA-Z0-9\s]+$/;
    if (!direccionPattern.test(this.direccion)) {
      this.presentAlert('Error', 'La dirección solo puede contener letras, números y espacios.');
      return;
    }

      // Validar contraseña
  if (this.password.length < 10 || this.password.length > 30) {
    this.presentAlert('Error', 'La contraseña debe tener entre 10 y 30 caracteres.');
    return;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
    this.presentAlert('Error', 'La contraseña debe contener al menos un carácter especial.');
    return;
  }

  if (/(\d)\1/.test(this.password) || /([a-zA-Z])\1/.test(this.password)) {
    this.presentAlert('Error', 'La contraseña no debe contener caracteres o números consecutivos repetidos.');
    return;
  }

  if (!/(?=.*[A-Z].*[A-Z])/.test(this.password)) {
    this.presentAlert('Error', 'La contraseña debe contener al menos dos letras mayúsculas.');
    return; 
  }

    // Si todas las validaciones pasan
    await this.bd.insertarUsuario(
      this.pNombre, this.sNombre, this.aPaterno, this.aMaterno, this.email, 
      this.password, this.empresa, this.descEmpresa, '', this.estadoUsuario, 
      this.tipoUsuario, this.comuna, this.direccion
    );
    this.presentAlert('Éxito', 'Su ha agregado el cliente exitosamente.');
    console.log('Formulario válido, proceder con el registro.');
    this.modalController.dismiss();
  }


 
}

