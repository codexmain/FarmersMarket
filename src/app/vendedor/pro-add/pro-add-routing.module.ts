import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProAddPage } from './pro-add.page';

const routes: Routes = [
  {
    path: '',
    component: ProAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProAddPageRoutingModule {}
