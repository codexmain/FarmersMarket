import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProModPage } from './pro-mod.page';

const routes: Routes = [
  {
    path: '',
    component: ProModPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProModPageRoutingModule {}
