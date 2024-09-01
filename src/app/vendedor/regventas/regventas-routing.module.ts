import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegventasPage } from './regventas.page';

const routes: Routes = [
  {
    path: '',
    component: RegventasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegventasPageRoutingModule {}
