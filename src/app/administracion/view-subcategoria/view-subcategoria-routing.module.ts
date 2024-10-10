import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewSubcategoriaPage } from './view-subcategoria.page';

const routes: Routes = [
  {
    path: '',
    component: ViewSubcategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSubcategoriaPageRoutingModule {}
