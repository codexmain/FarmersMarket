import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {//! es obligatoria, ? es opcional
  userData: any;


  constructor(private route: Router, private activerouter: ActivatedRoute) {
    this.userData = this.route.getCurrentNavigation()?.extras?.state;
    
  }
  ngOnInit() {

  }

}
