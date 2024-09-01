import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendedorPagePageRoutingModule } from './vendedor-page-routing.module';

import { VendedorPagePage } from './vendedor-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendedorPagePageRoutingModule
  ],
  declarations: [VendedorPagePage]
})
export class VendedorPagePageModule {}
