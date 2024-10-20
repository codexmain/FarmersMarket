import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProDetallePage } from './pro-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: ProDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProDetallePageRoutingModule {}
