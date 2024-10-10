import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewUsuarioPage } from './view-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ViewUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewUsuarioPageRoutingModule {}
