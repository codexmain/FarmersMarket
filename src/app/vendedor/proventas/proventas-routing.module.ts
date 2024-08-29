import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProventasPage } from './proventas.page';

const routes: Routes = [
  {
    path: '',
    component: ProventasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProventasPageRoutingModule {}
