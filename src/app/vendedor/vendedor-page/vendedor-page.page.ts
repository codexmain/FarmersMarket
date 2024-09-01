import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-vendedor-page',
  templateUrl: './vendedor-page.page.html',
  styleUrls: ['./vendedor-page.page.scss'],
})
export class VendedorPagePage implements OnInit {//! es obligatoria, ? es opcional
  pfp?: string; //aca se va a ocupar el path de la imagen
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

  constructor(private router: Router, private activerouter: ActivatedRoute) {
    this.activerouter.queryParams.subscribe(param => {
      //valido si en la navegación existe la variable de contexto
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.pfp = this.router.getCurrentNavigation()?.extras?.state?.['perfil'];
        this.primerNombre = this.router.getCurrentNavigation()?.extras?.state?.['fstName'];
        this.segundoNombre = this.router.getCurrentNavigation()?.extras?.state?.['sndName'];
        this.aPaterno = this.router.getCurrentNavigation()?.extras?.state?.['fstSurname'];
        this.aMaterno = this.router.getCurrentNavigation()?.extras?.state?.['sndSurname'];
        this.correo = this.router.getCurrentNavigation()?.extras?.state?.['mail'];
        this.clave = this.router.getCurrentNavigation()?.extras?.state?.['pwd'];
        this.empresa = this.router.getCurrentNavigation()?.extras?.state?.['company'];
        this.estadoUser = this.router.getCurrentNavigation()?.extras?.state?.['uStatus'];
        this.tipoUser = this.router.getCurrentNavigation()?.extras?.state?.['userType'];
        this.region = this.router.getCurrentNavigation()?.extras?.state?.['reg'];
        this.comuna = this.router.getCurrentNavigation()?.extras?.state?.['com'];
        this.direccion = this.router.getCurrentNavigation()?.extras?.state?.['loc'];
        this.emails = this.router.getCurrentNavigation()?.extras?.state?.['emails']; //recibir array de correos
      }
    })

  }
  ngOnInit() {
    console.log(this.emails);
  }

  navigateToUsuario() { //transferencia de array de correos a la parte de usuario
    let navigationExtras: NavigationExtras = {
      state: {
        emails: this.emails
      }
    };
    this.router.navigate(['/usuario'], navigationExtras);
  }

  navigateToProventas() { //transferencia de array de correos a la parte de proventas
    let navigationExtras: NavigationExtras = {
      state: {
        emails: this.emails
      }
    };
    this.router.navigate(['/proventas'], navigationExtras);
  }

  navigateToRegventas() { //transferencia de array de correos a la parte de regventas
    let navigationExtras: NavigationExtras = {
      state: {
        emails: this.emails
      }
    };
    this.router.navigate(['/regventas'], navigationExtras);
  }

}
