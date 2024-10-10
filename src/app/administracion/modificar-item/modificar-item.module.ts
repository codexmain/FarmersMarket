import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModificarItemPageRoutingModule } from './modificar-item-routing.module';

import { ModificarItemPage } from './modificar-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModificarItemPageRoutingModule
  ],
  declarations: [ModificarItemPage]
})
export class ModificarItemPageModule {}
