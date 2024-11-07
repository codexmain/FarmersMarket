import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HacerAmonestacionPage } from './hacer-amonestacion.page';

const routes: Routes = [
  {
    path: '',
    component: HacerAmonestacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HacerAmonestacionPageRoutingModule {}
