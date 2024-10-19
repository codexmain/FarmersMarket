import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarCategoriaPage } from './modificar-categoria.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarCategoriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarCategoriaPageRoutingModule {}
