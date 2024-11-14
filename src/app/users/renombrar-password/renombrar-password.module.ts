import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RenombrarPasswordPageRoutingModule } from './renombrar-password-routing.module';

import { RenombrarPasswordPage } from './renombrar-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RenombrarPasswordPageRoutingModule
  ],
  declarations: [RenombrarPasswordPage]
})
export class RenombrarPasswordPageModule {}
