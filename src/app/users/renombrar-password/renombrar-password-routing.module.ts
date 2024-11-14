import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenombrarPasswordPage } from './renombrar-password.page';

const routes: Routes = [
  {
    path: '',
    component: RenombrarPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenombrarPasswordPageRoutingModule {}
