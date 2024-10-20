import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModProventasPageRoutingModule } from './mod-proventas-routing.module';

import { ModProventasPage } from './mod-proventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModProventasPageRoutingModule
  ],
  declarations: [ModProventasPage]
})
export class ModProventasPageModule {}
