import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { AddUsuariosPage } from '../add-usuarios/add-usuarios.page';
import { ViewUsuarioPage } from '../view-usuario/view-usuario.page';
import { ModificarUsuarioPage } from '../modificar-usuario/modificar-usuario.page';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service';
import { Usuarios } from 'src/app/services/usuarios';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { HacerAmonestacionPage } from '../hacer-amonestacion/hacer-amonestacion.page';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarioAct: any; // Para almacenar los datos del usuario actual
  searchTerm: string = '';

  arregloUsuarios: any = [
    {
      id: '',
      nombre: '',
      segundo_nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      nombreCompleto: '',
      email: '',
      contrasena: '',
      nombre_empresa: '',
      empresaMostrarListar: '',
      descripcion_corta: '',
      descripcionMostrarListar: '',
      foto_perfil: '',
      estado_cuenta: '',
      fecha_registro: '',
      tipo_usuario_id: '',
      descTipUser: ''
    }
  ];

  filteredUsuarios: any = [
    {
      id: '',
      nombre: '',
      segundo_nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      nombreCompleto: '',
      email: '',
      contrasena: '',
      nombre_empresa: '',
      empresaMostrarListar: '',
      descripcion_corta: '',
      descripcionMostrarListar: '',
      foto_perfil: '',
      estado_cuenta: '',
      fecha_registro: '',
      tipo_usuario_id: '',
      descTipUser: ''
    }
  ];

  constructor(
    private bd: DataBaseService,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private nativeStorage: NativeStorage,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarDatosUsuario(); // Cargar datos del usuario actual
    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchUsuarios().subscribe(res => {
          this.arregloUsuarios = res;
          this.filteredUsuarios = res;
        });
      }
    });
  }

  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail');
      if (email) {
        this.usuarioAct = await this.bd.getUsuarioByEmail(email); // Obtener datos del usuario por email
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  searchUsuarios() {
    if (this.searchTerm.trim() === '') {
      this.filteredUsuarios = this.arregloUsuarios;
    } else {
      this.filteredUsuarios = this.arregloUsuarios.filter((user: Usuarios) =>
        user.nombreCompleto.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  async presentActionSheet(x: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Modificar',
          handler: () => this.modificar(x)
        },
        {
          text: 'Visualizar',
          handler: () => this.visualizar(x)
        },
        {
          text: 'Amonestar',
          handler: () => this.openAmonestacionModal(x)
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminar(x)
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddUsuariosPage,
    });
    return await modal.present();
  }

  async openAmonestacionModal(x: any) {
    const modal = await this.modalController.create({
      component: HacerAmonestacionPage,
      componentProps: { usuario: x } // Pasar datos del usuario seleccionado
    });
    return await modal.present();
  }

  async modificar(x: any) {
    const modal = await this.modalController.create({
      component: ModificarUsuarioPage,
      componentProps: { usuario: x }
    });
    return await modal.present();
  }

  async visualizar(x: any) {
    const modal = await this.modalController.create({
      component: ViewUsuarioPage,
      componentProps: { usuario: x }
    });
    return await modal.present();
  }

  async eliminar(x: any) {
    const usuarioAct = this.usuarioAct;
    if (usuarioAct && x.id === usuarioAct.id) {
      this.presentAlert('Error', 'No puedes eliminar tu propia cuenta.');
      return;
    }
    await this.bd.eliminarUsuario(
      x.id,
      x.nombre,
      x.segundo_nombre,
      x.apellido_paterno,
      x.apellido_materno,
      x.email,
      x.contrasena,
      x.nombre_empresa,
      x.descripcion_corta,
      x.foto_perfil,
      x.estado_cuenta,
      x.tipo_usuario_id
    );
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  agregar() {
    this.presentModal();
  }
}
