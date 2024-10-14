import { Component, OnInit } from '@angular/core';
import { DataBaseService } from 'src/app/services/data-base.service';

@Component({
  selector: 'app-test-page-sql',
  templateUrl: './test-page-sql.page.html',
  styleUrls: ['./test-page-sql.page.scss'],
})
export class TestPageSqlPage implements OnInit {

  public language: string;
  public languages: string[];

  constructor(
    private dataBaseService: DataBaseService
  ) {
    this.language = '';
    this.languages = [];
  }

  ngOnInit() {
  }


 // Al entrar, leemos la base de datos
 ionViewWillEnter(){
  this.read();
}

create(){
  // Creamos un elemento en la base de datos
  this.dataBaseService.create(this.language.toUpperCase()).then( (changes) =>{
    console.log(changes);
    console.log("Creado");
    this.language = '';
    this.read(); // Volvemos a leer
  }).catch(err => {
    console.error(err);
    console.error("Error al crear");
  })
}

read(){
  // Leemos los datos de la base de datos
  this.dataBaseService.read().then( (languages: string[]) => {
    this.languages = languages;
    console.log("Leido");
    console.log(this.languages);
  }).catch(err => {
    console.error(err);
    console.error("Error al leer");
  })
}

update(language: string){
  // Actualizamos el elemento (language) por el nuevo elemento (this.language)
  this.dataBaseService.update(this.language.toUpperCase(), language).then( (changes) => {
    console.log(changes);
    console.log("Actualizado");
    this.language = '';
    this.read(); // Volvemos a leer
  }).catch(err => {
    console.error(err);
    console.error("Error al actualizar");
  })
}

delete(language: string){
  // Borramos el elemento
  this.dataBaseService.delete(language).then( (changes) => {
    console.log(changes);
    console.log("Borrado");
    this.read(); // Volvemos a leer
  }).catch(err => {
    console.error(err);
    console.error("Error al borrar");
  })
}

}