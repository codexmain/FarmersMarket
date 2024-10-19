import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../../services/data-base.service'; // Ruta del servicio de base de datos
import { Usuarios } from 'src/app/services/usuarios'; // Asegúrate de que la ruta sea correcta
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  userData: any;
  usuarios: Usuarios[] = []; // Array para almacenar todos los usuarios
  filteredUsuarios: Usuarios[] = []; // Array para almacenar los usuarios filtrados
  searchTerm: string = ''; // Término de búsqueda

  constructor(private databaseService: DataBaseService,
    private route: Router,
    private activerouter: ActivatedRoute) {
      this.userData = this.route.getCurrentNavigation()?.extras?.state;

    } // Inyección del servicio de base de datos

  ngOnInit() {
    this.seleccionarUsuarios(); // Llama a la función para obtener los usuarios

    // Suscribirse a la lista de usuarios desde el servicio
    this.databaseService.listadoUsuarios.subscribe((usuarios) => {
      this.usuarios = usuarios; // Almacena todos los usuarios
      this.filteredUsuarios = usuarios; // Inicialmente, muestra todos los usuarios
    });
  }

  // Método para obtener usuarios de la base de datos
  seleccionarUsuarios() {
    this.databaseService.seleccionarUsuarios(); // Llama al método de tu servicio
  }

  // Método para filtrar usuarios según el texto de búsqueda
  buscarUsuario(event: any) {
    const query = event.target.value.toLowerCase(); // Obtén el valor de la búsqueda
    this.filteredUsuarios = this.usuarios.filter((usuario) =>
      usuario.nombreCompleto.toLowerCase().includes(query) // Filtra por nombre completo
    );
  }
  navigateToUserDetail() {
    let navigationextras: NavigationExtras = {
      state: this.userData
    };
    this.route.navigate(['/cuenta'], navigationextras);
  }
}