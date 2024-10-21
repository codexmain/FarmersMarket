import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-view-usuario',
  templateUrl: './view-usuario.page.html',
  styleUrls: ['./view-usuario.page.scss'],
})
export class ViewUsuarioPage implements OnInit {
    isDisabled = true;

    //esto para traer la data de la parte principal
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
    foto_perfil: String='';
  
    arrayCmbTipoUsuario: any = [
      {
        id: '',
        descripcion: '',
      }
    ]
  

  constructor(private modalController: ModalController, private navParams: NavParams, private bd: DataBaseService) { 
    // Obtener el usuario desde NavParams
    this.usuario = this.navParams.get('usuario'); //obtener todos los datos del usuario en especifico
  }

  ngOnInit() {
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

    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        this.bd.fetchCmbTipUsuario().subscribe(res=>{
          this.arrayCmbTipoUsuario = res;
        })     
      }
    })
  }




  dismiss() {
    this.modalController.dismiss();
  }

}
