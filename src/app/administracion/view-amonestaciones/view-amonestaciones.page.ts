import { Component, OnInit } from '@angular/core';
import { Amonestaciones } from 'src/app/services/amonestaciones';
import { DataBaseService } from 'src/app/services/data-base.service';


@Component({
  selector: 'app-view-amonestaciones',
  templateUrl: './view-amonestaciones.page.html',
  styleUrls: ['./view-amonestaciones.page.scss'],
})
export class ViewAmonestacionesPage implements OnInit {
  searchTerm: string = '';

  arregloAmonestaciones: any = [
    {
      id: '',
      usuario_id: '',
      nombre_usuario: '',
      nombre_empresa: '', 
      id_producto: '',
      nombre_producto: '',
      descripcion: ''
      
    }
  ]; 

  filteredAmonestaciones: any = [
    {
      id: '',
      usuario_id: '',
      nombre_usuario: '',
      nombre_empresa: '', 
      id_producto: '',
      nombre_producto: '',
      descripcion: ''
      
    }
  ];

  constructor(
    private bd: DataBaseService,
  ) { }

  ngOnInit() {

    this.bd.dbState().subscribe(data => {
      if (data) {
        this.bd.fetchAmonestaciones().subscribe(res => {
          this.arregloAmonestaciones = res;
          this.filteredAmonestaciones = res;
        });
      }
    });
  }

  searchAmonestaciones() {
    if (this.searchTerm.trim() === '') {
      this.filteredAmonestaciones = this.arregloAmonestaciones;
    } else {
      this.filteredAmonestaciones = this.arregloAmonestaciones.filter((amonestacion: Amonestaciones) =>
        amonestacion.nombre_usuario.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

}
