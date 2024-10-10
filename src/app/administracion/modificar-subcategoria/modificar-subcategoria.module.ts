import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarSubcategoriaPageRoutingModule } from './modificar-subcategoria-routing.module';

import { ModificarSubcategoriaPage } from './modificar-subcategoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarSubcategoriaPageRoutingModule
  ],
  declarations: [ModificarSubcategoriaPage]
})
export class ModificarSubcategoriaPageModule {}
