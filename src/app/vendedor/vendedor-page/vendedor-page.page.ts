import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-vendedor-page',
  templateUrl: './vendedor-page.page.html',
  styleUrls: ['./vendedor-page.page.scss'],
})
export class VendedorPagePage implements OnInit {//! es obligatoria, ? es opcional
  userData: any;

  constructor(private route: Router, private activerouter: ActivatedRoute) { 
    this.userData = this.route.getCurrentNavigation()?.extras?.state;
  }
  ngOnInit() {
    
  }

  navigateToUsuario() { //transferencia de array de correos a la parte de usuario
    let navigationextras: NavigationExtras = {
      state: this.userData
    };
    this.route.navigate(['/usuario'], navigationextras);
  }

  navigateToProventas() { //transferencia de array de correos a la parte de proventas
    let navigationextras: NavigationExtras = {
      state: this.userData
    };
    this.route.navigate(['/proventas'], navigationextras);
  }

  navigateToRegventas() { //transferencia de array de correos a la parte de regventas
    let navigationextras: NavigationExtras = {
      state: this.userData
    };
    this.route.navigate(['/regventas'], navigationextras);
  }

}
