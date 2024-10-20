import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModCuentaPageRoutingModule } from './mod-cuenta-routing.module';

import { ModCuentaPage } from './mod-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModCuentaPageRoutingModule
  ],
  declarations: [ModCuentaPage]
})
export class ModCuentaPageModule {}
