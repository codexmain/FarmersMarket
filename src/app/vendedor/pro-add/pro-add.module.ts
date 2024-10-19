import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProAddPageRoutingModule } from './pro-add-routing.module';

import { ProAddPage } from './pro-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProAddPageRoutingModule
  ],
  declarations: [ProAddPage]
})
export class ProAddPageModule {}
