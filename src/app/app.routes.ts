import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'customer', loadComponent: () => import('./pages/customer/list.component').then(m => m.ListComponent) },
  { path: 'customer/detail/:id', loadComponent: () => import('./pages/customer/detail.component').then(m => m.DetailComponent) },
  { path: 'customer/create-invoice/:id?', loadComponent: () => import('./pages/customer/create-invoice.component').then(m => m.CreateInvoiceComponent) },
  //{ path: 'path/supplier/create-invoice', loadComponent: () => import('./pages/supplier/create-invoice.component').then(m => m.CreateInvoiceComponent) }
];
