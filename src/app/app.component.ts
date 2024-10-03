import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  userEmail: string='';
  ngOnInit() {
    this.updateUserEmail();
  }
  updateUserEmail() {
    this.userEmail = localStorage.getItem('userEmail') || 'Correo';
  }
  
  constructor(private router: Router) {}
  Salir() {
    localStorage.removeItem('userEmail');
  }
}

