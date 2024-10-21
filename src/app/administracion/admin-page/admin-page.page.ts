import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { DataBaseService } from 'src/app/services/data-base.service';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
})
export class AdminPagePage implements OnInit {
  //! es obligatoria, ? es opcional
  pfp?: string; //aca se va a ocupar el path de la imagen
  userData: any;
  primerNombre!: string;
  segundoNombre?: string;
  aPaterno!: string;
  aMaterno?: string;
  correo!: string;
  clave!: string;
  empresa?: string;
  estadoUser!: string;
  tipoUser!: number;
  region!: string;
  comuna!: string;
  direccion!: string;
  emails: string[] = []; //recibimiento de todos los email para validaciones, desde el login

  constructor(
    private router: Router,
    private activerouter: ActivatedRoute,
    private nativeStorage: NativeStorage,
    private dbService: DataBaseService
  ) {
    
    this.userData = this.router.getCurrentNavigation()?.extras?.state;
    this.activerouter.queryParams.subscribe((param) => {
      //valido si en la navegación existe la variable de contexto
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.pfp =
          this.router.getCurrentNavigation()?.extras?.state?.['perfil'];
        this.primerNombre =
          this.router.getCurrentNavigation()?.extras?.state?.['fstName'];
        this.segundoNombre =
          this.router.getCurrentNavigation()?.extras?.state?.['sndName'];
        this.aPaterno =
          this.router.getCurrentNavigation()?.extras?.state?.['fstSurname'];
        this.aMaterno =
          this.router.getCurrentNavigation()?.extras?.state?.['sndSurname'];
        this.correo =
          this.router.getCurrentNavigation()?.extras?.state?.['mail'];
        this.clave = this.router.getCurrentNavigation()?.extras?.state?.['pwd'];
        this.empresa =
          this.router.getCurrentNavigation()?.extras?.state?.['company'];
        this.estadoUser =
          this.router.getCurrentNavigation()?.extras?.state?.['uStatus'];
        this.tipoUser =
          this.router.getCurrentNavigation()?.extras?.state?.['userType'];
        this.region =
          this.router.getCurrentNavigation()?.extras?.state?.['reg'];
        this.comuna =
          this.router.getCurrentNavigation()?.extras?.state?.['com'];
        this.direccion =
          this.router.getCurrentNavigation()?.extras?.state?.['loc'];
        this.emails =
          this.router.getCurrentNavigation()?.extras?.state?.['emails']; //recibir array de correos
      }
    });
  }

  async ngOnInit() {
    await this.cargarDatosUsuario();
    console.log(this.emails);
  }


  async ionViewWillEnter() {
    // Recargar datos cada vez que la vista está a punto de entrar
    await this.cargarDatosUsuario();
  }


  async cargarDatosUsuario() {
    try {
      const email = await this.nativeStorage.getItem('userEmail'); // Obtener el email del almacenamiento local

      if (email) {
        // Obtener datos del usuario desde la base de datos
        this.userData = await this.dbService.getUsuarioByEmail(email);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  navigateToUsers() {
    //transferencia de array de correos a la parte de clientes
    let navigationExtras: NavigationExtras = {
      state: {
        emails: this.emails,
      },
    };
    this.router.navigate(['/usuarios'], navigationExtras);
  }
}
