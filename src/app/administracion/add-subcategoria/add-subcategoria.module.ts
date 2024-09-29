import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSubcategoriaPageRoutingModule } from './add-subcategoria-routing.module';

import { AddSubcategoriaPage } from './add-subcategoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSubcategoriaPageRoutingModule
  ],
  declarations: [AddSubcategoriaPage]
})
export class AddSubcategoriaPageModule {}
