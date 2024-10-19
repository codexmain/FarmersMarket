import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarCategoriaPageRoutingModule } from './modificar-categoria-routing.module';

import { ModificarCategoriaPage } from './modificar-categoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarCategoriaPageRoutingModule
  ],
  declarations: [ModificarCategoriaPage]
})
export class ModificarCategoriaPageModule {}
