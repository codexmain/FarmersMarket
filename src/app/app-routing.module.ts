import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./users/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./users/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'recuperar-password',
    loadChildren: () => import('./users/recuperar-password/recuperar-password.module').then( m => m.RecuperarPasswordPageModule)
  },
  {
    path: 'admin-page',
    loadChildren: () => import('./administracion/admin-page/admin-page.module').then( m => m.AdminPagePageModule)
  },
  {
    path: 'sellers',
    loadChildren: () => import('./administracion/sellers/sellers.module').then( m => m.SellersPageModule)
  },
  {
    path: 'clients',
    loadChildren: () => import('./administracion/clients/clients.module').then( m => m.ClientsPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./users/notfound/notfound.module').then( m => m.NotfoundPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
