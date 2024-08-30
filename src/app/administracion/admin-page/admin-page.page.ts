import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.page.html',
  styleUrls: ['./admin-page.page.scss'],
})
export class AdminPagePage implements OnInit {  //! es obligatoria, ? es opcional
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



  constructor(private router: Router, private activerouter: ActivatedRoute) {
    this.activerouter.queryParams.subscribe(param =>{
      //valido si en la navegación existe la variable de contexto
      if(this.router.getCurrentNavigation()?.extras.state){
        this.pfp = this.router.getCurrentNavigation()?.extras?.state?.['perfil'];
        this.primerNombre = this.router.getCurrentNavigation()?.extras?.state?.['fstName'];
        this.segundoNombre = this.router.getCurrentNavigation()?.extras?.state?.['sndName'];
        this.aPaterno = this.router.getCurrentNavigation()?.extras?.state?.['fstSurname'];
        this.aMaterno = this.router.getCurrentNavigation()?.extras?.state?.['sndSurname'];
        this.correo = this.router.getCurrentNavigation()?.extras?.state?.['mail'];
        this.clave= this.router.getCurrentNavigation()?.extras?.state?.['pwd'];
        this.empresa = this.router.getCurrentNavigation()?.extras?.state?.['company'];
        this.estadoUser = this.router.getCurrentNavigation()?.extras?.state?.['uStatus'];
        this.tipoUser = this.router.getCurrentNavigation()?.extras?.state?.['userType'];
        this.region = this.router.getCurrentNavigation()?.extras?.state?.['reg'];
        this.comuna = this.router.getCurrentNavigation()?.extras?.state?.['com'];
        this.direccion = this.router.getCurrentNavigation()?.extras?.state?.['loc'];
      }
    })

   }


  ngOnInit() {
  }


}
