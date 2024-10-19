import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewSubcategoriaPageRoutingModule } from './view-subcategoria-routing.module';

import { ViewSubcategoriaPage } from './view-subcategoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewSubcategoriaPageRoutingModule
  ],
  declarations: [ViewSubcategoriaPage]
})
export class ViewSubcategoriaPageModule {}
