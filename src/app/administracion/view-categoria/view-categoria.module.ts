import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCategoriaPageRoutingModule } from './view-categoria-routing.module';

import { ViewCategoriaPage } from './view-categoria.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewCategoriaPageRoutingModule
  ],
  declarations: [ViewCategoriaPage]
})
export class ViewCategoriaPageModule {}
