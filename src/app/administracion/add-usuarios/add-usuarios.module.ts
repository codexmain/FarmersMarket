import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonicModule } from '@ionic/angular';

import { AddUsuariosPageRoutingModule } from './add-usuarios-routing.module';

import { AddUsuariosPage } from './add-usuarios.page';

@NgModule({
  

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUsuariosPageRoutingModule
  ],
  declarations: [AddUsuariosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddUsuariosPageModule {}
