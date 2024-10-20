import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProventasPageRoutingModule } from './add-proventas-routing.module';

import { AddProventasPage } from './add-proventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProventasPageRoutingModule
  ],
  declarations: [AddProventasPage]
})
export class AddProventasPageModule {}
