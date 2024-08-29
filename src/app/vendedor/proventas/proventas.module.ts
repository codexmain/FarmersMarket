import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProventasPageRoutingModule } from './proventas-routing.module';

import { ProventasPage } from './proventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProventasPageRoutingModule
  ],
  declarations: [ProventasPage]
})
export class ProventasPageModule {}
