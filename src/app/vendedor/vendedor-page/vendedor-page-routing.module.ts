import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendedorPagePage } from './vendedor-page.page';

const routes: Routes = [
  {
    path: '',
    component: VendedorPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendedorPagePageRoutingModule {}
