import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegventasPageRoutingModule } from './regventas-routing.module';

import { RegventasPage } from './regventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegventasPageRoutingModule
  ],
  declarations: [RegventasPage]
})
export class RegventasPageModule {}
