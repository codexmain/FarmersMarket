import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProInicioPageRoutingModule } from './pro-inicio-routing.module';

import { ProInicioPage } from './pro-inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProInicioPageRoutingModule
  ],
  declarations: [ProInicioPage]
})
export class ProInicioPageModule {}
