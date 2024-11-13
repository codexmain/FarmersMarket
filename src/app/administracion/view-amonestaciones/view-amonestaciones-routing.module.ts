import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAmonestacionesPage } from './view-amonestaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAmonestacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAmonestacionesPageRoutingModule {}
