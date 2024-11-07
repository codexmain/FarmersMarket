import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAmonestacionesPageRoutingModule } from './view-amonestaciones-routing.module';

import { ViewAmonestacionesPage } from './view-amonestaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAmonestacionesPageRoutingModule
  ],
  declarations: [ViewAmonestacionesPage]
})
export class ViewAmonestacionesPageModule {}
