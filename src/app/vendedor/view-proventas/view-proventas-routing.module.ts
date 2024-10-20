import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewProventasPage } from './view-proventas.page';

const routes: Routes = [
  {
    path: '',
    component: ViewProventasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewProventasPageRoutingModule {}
