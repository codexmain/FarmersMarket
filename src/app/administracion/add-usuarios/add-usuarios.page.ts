import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, AlertController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';


interface RegionesComunas { //permite hacer la dependencia de comuna / region, para que sea interactivo cada vez que se cambie la region, se vean diferentes comunas
  [key: string]: string[];
}

@Component({
  selector: 'app-add-usuarios',
  templateUrl: './add-usuarios.page.html',
  styleUrls: ['./add-usuarios.page.scss'],
})
export class AddUsuariosPage implements OnInit {


  constructor(private modalController: ModalController, private menu: MenuController, private route: ActivatedRoute, private router: Router, public alertController: AlertController, private navParams: NavParams) { 

  }
  emails: string[] = [];
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
    magallanes: ['Punta Arenas', 'Puerto Natales']
  };

  pNombre: string = '';
  sNombre: string = '';
  aPaterno: string = '';
  aMaterno: string = '';
  email: string = '';
  password: string = '';
  empresa: string = '';
  descEmpresa: string = '';
  region: string = '';
  comuna: string = '';
  direccion: string = '';
  estadoUsuario: string ='';
  

  onRegionChange(event: any) {
    this.selectedRegion = event.detail.value;
    this.comunas = this.regionesComunas[this.selectedRegion] || [];
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
    this.emails = this.navParams.get('emails'); //transferencia de data
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
  
  // Validar empresa
  if (!this.empresa) {
    this.presentAlert('Error', 'La empresa es un campo obligatorio.');
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
    if (this.emails.includes(this.email)) {
      this.presentAlert('Error', 'El email ingresado ya está asociado a otra cuenta.');
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
    this.presentAlert('Éxito', 'Su ha agregado el cliente exitosamente.');
    console.log('Formulario válido, proceder con el registro.');
    this.modalController.dismiss();
  }

  ngOnInit() {
    console.log(this.emails);
  }
 
}

