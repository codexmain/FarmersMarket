import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController, ActionSheetController} from '@ionic/angular';
import { AddUsuariosPage } from '../add-usuarios/add-usuarios.page'
import { ViewUsuarioPage } from '../view-usuario/view-usuario.page';
import { ModificarUsuarioPage } from '../modificar-usuario/modificar-usuario.page';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBaseService } from 'src/app/services/data-base.service'

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {


  constructor(private bd: DataBaseService, private modalController: ModalController, private route: ActivatedRoute, private router: Router,private actionSheetController: ActionSheetController) {

  }

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
  ]





  ngOnInit() {
    this.bd.dbState().subscribe(data=>{
      //validar si la bd esta lista
      if(data){
        //subscribir al observable de la listaNoticias
        this.bd.fetchUsuarios().subscribe(res=>{
          this.arregloUsuarios = res;
        })
      }
    })
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


    async presentModal() { //este present modal es para 
      const modal = await this.modalController.create({
        component: AddUsuariosPage,
      });
  
      return await modal.present();}
    

    async modificar(x: any) {
      const modal = await this.modalController.create({
        component: ModificarUsuarioPage, //crear la pagina de edicio
        componentProps: { usuario: x }
      });
      modal.onDidDismiss().then(() => {
      });
      return await modal.present();
    }

    async visualizar(x: any) {
      const modal = await this.modalController.create({
        component: ViewUsuarioPage, //crear la pagina de visualizacion
        componentProps: { usuario: x }
      });
      return await modal.present();
    }

    eliminar(x: any) {
      this.bd.eliminarUsuario(x.id)
    }

    agregar() {
      this.presentModal(); // Mostrar modal para agregar usuario
    }
  }






