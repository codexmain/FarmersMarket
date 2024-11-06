import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProModPageRoutingModule } from './pro-mod-routing.module';

import { ProModPage } from './pro-mod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProModPageRoutingModule
  ],
  declarations: [ProModPage]
})
export class ProModPageModule {}
