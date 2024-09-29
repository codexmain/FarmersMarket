import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubcategoriasPageRoutingModule } from './subcategorias-routing.module';

import { SubcategoriasPage } from './subcategorias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubcategoriasPageRoutingModule
  ],
  declarations: [SubcategoriasPage]
})
export class SubcategoriasPageModule {}
