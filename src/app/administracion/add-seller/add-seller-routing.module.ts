import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSellerPage } from './add-seller.page';

const routes: Routes = [
  {
    path: '',
    component: AddSellerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSellerPageRoutingModule {}
