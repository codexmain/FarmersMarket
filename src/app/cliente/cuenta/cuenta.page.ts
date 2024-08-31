import { ɵnormalizeQueryParams } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {
  userData: any;


  constructor(private route: Router, private activerouter: ActivatedRoute) {
    this.userData = this.route.getCurrentNavigation()?.extras?.state;
    
  }


  ngOnInit() {
  }

}