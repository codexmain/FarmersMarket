import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HacerAmonestacionPageRoutingModule } from './hacer-amonestacion-routing.module';

import { HacerAmonestacionPage } from './hacer-amonestacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HacerAmonestacionPageRoutingModule
  ],
  declarations: [HacerAmonestacionPage]
})
export class HacerAmonestacionPageModule {}
