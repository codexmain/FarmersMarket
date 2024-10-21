import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  usuario: any;

  constructor(
    private dbService: DataBaseService,
    private nativeStorage: NativeStorage,
    private router: Router
  ) {}

  async ngOnInit() {
   // Cargar datos al inicializar el componente
   await this.cargarDatosUsuario();
   this.recibirDatosDesdeNavegacion();
 }

 async ionViewWillEnter() {
   // Recargar datos cada vez que la vista está a punto de entrar
   await this.cargarDatosUsuario();
 }

 async cargarDatosUsuario() {
   try {
     const email = await this.nativeStorage.getItem('userEmail');

     if (email) {
       // Obtener datos del usuario desde la base de datos
       this.usuario = await this.dbService.getUsuarioByEmail(email);
     }
   } catch (error) {
     console.error('Error al cargar los datos del usuario:', error);
   }
 }

 recibirDatosDesdeNavegacion() {
   const navigation = this.router.getCurrentNavigation();
   if (navigation && navigation.extras.state) {
     const usuarioActualizado = navigation.extras.state['usuario'];
     if (usuarioActualizado) {
       this.usuario = usuarioActualizado; // Actualiza el usuario con los datos recibidos
     }
   }
 }

  irAModUsuario() {
    this.router.navigate(['/mod-usuario']);
  }
}