import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModUsuarioPageRoutingModule } from './mod-usuario-routing.module';

import { ModUsuarioPage } from './mod-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModUsuarioPageRoutingModule
  ],
  declarations: [ModUsuarioPage]
})
export class ModUsuarioPageModule {}
