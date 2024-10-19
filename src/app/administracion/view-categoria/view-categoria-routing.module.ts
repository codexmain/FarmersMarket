import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewCategoriaPage } from './view-categoria.page';

const routes: Routes = [
  {
    path: '',
    component: ViewCategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewCategoriaPageRoutingModule {}
