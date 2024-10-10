import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewUsuarioPageRoutingModule } from './view-usuario-routing.module';

import { ViewUsuarioPage } from './view-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewUsuarioPageRoutingModule
  ],
  declarations: [ViewUsuarioPage]
})
export class ViewUsuarioPageModule {}
