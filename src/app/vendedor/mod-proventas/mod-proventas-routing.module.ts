import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModProventasPage } from './mod-proventas.page';

const routes: Routes = [
  {
    path: '',
    component: ModProventasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModProventasPageRoutingModule {}
