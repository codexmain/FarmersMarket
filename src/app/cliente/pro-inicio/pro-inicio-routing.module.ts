import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProInicioPage } from './pro-inicio.page';

const routes: Routes = [
  {
    path: '',
    component: ProInicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProInicioPageRoutingModule {}
