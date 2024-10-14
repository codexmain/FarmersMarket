import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModificarItemPage } from './modificar-item.page';

const routes: Routes = [
  {
    path: '',
    component: ModificarItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModificarItemPageRoutingModule {}
