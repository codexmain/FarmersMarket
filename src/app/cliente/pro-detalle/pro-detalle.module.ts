import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProDetallePageRoutingModule } from './pro-detalle-routing.module';

import { ProDetallePage } from './pro-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProDetallePageRoutingModule
  ],
  declarations: [ProDetallePage]
})
export class ProDetallePageModule {}
