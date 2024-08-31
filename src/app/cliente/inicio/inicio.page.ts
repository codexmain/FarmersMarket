import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  userData: any;


  items: string[] = [];

  constructor(private route: Router, private activerouter: ActivatedRoute) { 
    this.userData = this.route.getCurrentNavigation()?.extras?.state;
  }

  ngOnInit() {
    for (let i = 1; i <= 50; i++) { 
      this.items.push(`<b>Vendedor asociado:</b> ${i}<br><b>Correo</b> ${i}`);
    }
  }

  navigateToUserDetail() {
    let navigationextras: NavigationExtras = {
      state: this.userData
    };
    this.route.navigate(['/cuenta'], navigationextras);
  }
}
