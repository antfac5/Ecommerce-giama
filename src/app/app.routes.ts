import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/catalog', pathMatch: 'full' }, // Default route
  { path: 'catalog', loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent) },
  /*TODO { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },*/
  { path: '**', redirectTo: '/catalog' } // Wildcard route per 404
];