import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewProventasPageRoutingModule } from './view-proventas-routing.module';

import { ViewProventasPage } from './view-proventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewProventasPageRoutingModule
  ],
  declarations: [ViewProventasPage]
})
export class ViewProventasPageModule {}
