import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSubcategoriaPage } from './add-subcategoria.page';

const routes: Routes = [
  {
    path: '',
    component: AddSubcategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSubcategoriaPageRoutingModule {}
