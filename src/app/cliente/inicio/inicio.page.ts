import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  userData: any; //pa transferir la data de otra parte


  items: string[] = []; // Explicitly define items as an array of strings

  constructor(private route: Router, private activerouter: ActivatedRoute) { 
    this.userData = this.route.getCurrentNavigation()?.extras?.state;
  }

  ngOnInit() {
    for (let i = 1; i <= 50; i++) { // Use <= to include Item 50
      this.items.push(`Vendedor ${i}`); // This should now work correctly
    }
  }

  navigateToUserDetail() {
    let navigationextras: NavigationExtras = {
      state: this.userData
    };
    this.route.navigate(['/cuenta'], navigationextras);
  }
}
