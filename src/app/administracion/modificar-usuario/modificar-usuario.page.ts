import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.page.html',
  styleUrls: ['./modificar-usuario.page.scss'],
})
export class ModificarUsuarioPage implements OnInit {
  usuario: any;

  //cosas del formulario
  pNombre: string = '';
  aPaterno: string = '';
  sNombre: string = '';
  aMaterno: string = '';
  email: string = '';
  contrasena: string = '';
  nombre_empresa: string = '';
  descripcion_corta: string = '';
  estado_cuenta: string = ''
  tipo_usuario_id!: number;


  constructor(private modalController: ModalController, private navParams: NavParams, private bd: DataBaseService) {
    // Obtener el usuario desde NavParams
    this.usuario = this.navParams.get('usuario'); //obtener todos los datos del usuario en especifico
  }

  ngOnInit() {
    //carga de los datos al formulario
    this.pNombre = this.usuario.nombre;
    this.aPaterno = this.usuario.apellido_paterno;
    this.sNombre = this.usuario.segundo_nombre;
    this.aMaterno = this.usuario.apellido_materno;
    this.email = this.usuario.email;
    this.contrasena = this.usuario.contrasena;
    this.nombre_empresa = this.usuario.nombre_empresa;
    this.descripcion_corta = this.usuario.descripcion_corta;
    this.estado_cuenta = this.usuario.estado_cuenta;
    this.tipo_usuario_id = this.usuario.tipo_usuario_id

  }

}
