import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSellerPageRoutingModule } from './add-seller-routing.module';

import { AddSellerPage } from './add-seller.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSellerPageRoutingModule
  ],
  declarations: [AddSellerPage]
})
export class AddSellerPageModule {}
