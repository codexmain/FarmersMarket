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
    path: 'usuario',
    loadChildren: () => import('./vendedor/usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
  {
    path: 'proventas',
    loadChildren: () => import('./vendedor/proventas/proventas.module').then( m => m.ProventasPageModule)
  },
  {
    path: 'regventas',
    loadChildren: () => import('./vendedor/regventas/regventas.module').then( m => m.RegventasPageModule)
  },
  {
    path: 'vendedor-page',
    loadChildren: () => import('./vendedor/vendedor-page/vendedor-page.module').then( m => m.VendedorPagePageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./administracion/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  
  {
    path: 'add-usuarios',
    loadChildren: () => import('./administracion/add-usuarios/add-usuarios.module').then( m => m.AddUsuariosPageModule)
  },
  {
    path: 'items',
    loadChildren: () => import('./administracion/items/items.module').then( m => m.ItemsPageModule)
  },
  {
    path: 'add-item',
    loadChildren: () => import('./administracion/add-item/add-item.module').then( m => m.AddItemPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./administracion/categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'add-categoria',
    loadChildren: () => import('./administracion/add-categoria/add-categoria.module').then( m => m.AddCategoriaPageModule)
  },
  {
    path: 'subcategorias',
    loadChildren: () => import('./administracion/subcategorias/subcategorias.module').then( m => m.SubcategoriasPageModule)
  },
  {
    path: 'add-subcategoria',
    loadChildren: () => import('./administracion/add-subcategoria/add-subcategoria.module').then( m => m.AddSubcategoriaPageModule)
  },
  {
    path: 'modificar-usuario',
    loadChildren: () => import('./administracion/modificar-usuario/modificar-usuario.module').then( m => m.ModificarUsuarioPageModule)
  },
  {
    path: 'modificar-categoria',
    loadChildren: () => import('./administracion/modificar-categoria/modificar-categoria.module').then( m => m.ModificarCategoriaPageModule)
  },
  {
    path: 'modificar-subcategoria',
    loadChildren: () => import('./administracion/modificar-subcategoria/modificar-subcategoria.module').then( m => m.ModificarSubcategoriaPageModule)
  },
  {
    path: 'modificar-item',
    loadChildren: () => import('./administracion/modificar-item/modificar-item.module').then( m => m.ModificarItemPageModule)
  },
  {
    path: 'view-item',
    loadChildren: () => import('./administracion/view-item/view-item.module').then( m => m.ViewItemPageModule)
  },
  {
    path: 'view-categoria',
    loadChildren: () => import('./administracion/view-categoria/view-categoria.module').then( m => m.ViewCategoriaPageModule)
  },
  {
    path: 'view-subcategoria',
    loadChildren: () => import('./administracion/view-subcategoria/view-subcategoria.module').then( m => m.ViewSubcategoriaPageModule)
  },
  {
    path: 'view-usuario',
    loadChildren: () => import('./administracion/view-usuario/view-usuario.module').then( m => m.ViewUsuarioPageModule)
  },
  {
    path: 'pro-mod',
    loadChildren: () => import('./vendedor/pro-mod/pro-mod.module').then( m => m.ProModPageModule)
  },
  {
    path: 'pro-add',
    loadChildren: () => import('./vendedor/pro-add/pro-add.module').then( m => m.ProAddPageModule)
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
