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
    loadChildren: () => import('./cliente/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./cliente/productos/productos.module').then( m => m.ProductosPageModule)
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
    path: 'compras',
    loadChildren: () => import('./cliente/compras/compras.module').then( m => m.ComprasPageModule)
  },
  {
    path: 'carrito',
    loadChildren: () => import('./cliente/carrito/carrito.module').then( m => m.CarritoPageModule)
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./cliente/cuenta/cuenta.module').then( m => m.CuentaPageModule)
  },
  {
    path: 'add-client',
    loadChildren: () => import('./administracion/add-client/add-client.module').then( m => m.AddClientPageModule)
  },
  {
    path: 'add-seller',
    loadChildren: () => import('./administracion/add-seller/add-seller.module').then( m => m.AddSellerPageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./vendedor/usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  {
    path: 'proventas',
    loadChildren: () => import('./vendedor/proventas/proventas.module').then( m => m.ProventasPageModule)
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
