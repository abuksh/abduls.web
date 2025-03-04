import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {CustomerListComponent} from './pages/customer/customer-list.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path:'customer-list', component: CustomerListComponent}
];
