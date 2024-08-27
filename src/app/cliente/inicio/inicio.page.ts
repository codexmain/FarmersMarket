import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  items: string[] = []; // Explicitly define items as an array of strings

  constructor() { }

  ngOnInit() {
    for (let i = 1; i <= 50; i++) { // Use <= to include Item 50
      this.items.push(`Item ${i}`); // This should now work correctly
    }
  }
}
