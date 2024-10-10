import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController, ActionSheetController} from '@ionic/angular';
import { AddUsuariosPage } from '../add-usuarios/add-usuarios.page'
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
      email: '',
      contrasena: '',
      nombre_empresa: '',
      descripcion_corta: '',
      foto_perfil: '',
      estado_cuenta: '',
      fecha_registro: '',
      tipo_usuario_id: ''
    }
  ]
  page: number = 0;




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


  async presentActionSheet(noticia: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Modificar',
          handler: () => this.modificar(noticia)
        },
        {
          text: 'Visualizar',
          handler: () => this.visualizar(noticia)
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminar(noticia)
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
    

    async modificar(usuario: any) {
      const modal = await this.modalController.create({
        component: EditNoticiasPage, //crear la pagina de edicio
        componentProps: { usuario: usuario }
      });
      modal.onDidDismiss().then(() => {
      });
      return await modal.present();
    }

    async visualizar(usuario: any) {
      const modal = await this.modalController.create({
        component: ViewNoticiasPage, //crear la pagina de visualizacion
        componentProps: { usuario: usuario }
      });
      return await modal.present();
    }

    eliminar(id: number) {
      this.bd.eliminarUsuario(id)
    }

    agregar() {
      this.presentModal(); // Mostrar modal para agregar usuario
    }
  }






