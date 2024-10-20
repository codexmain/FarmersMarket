import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProventasPage } from './add-proventas.page';

const routes: Routes = [
  {
    path: '',
    component: AddProventasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProventasPageRoutingModule {}
