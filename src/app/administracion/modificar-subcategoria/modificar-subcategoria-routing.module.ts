import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarSubcategoriaPage } from './modificar-subcategoria.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarSubcategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarSubcategoriaPageRoutingModule {}
