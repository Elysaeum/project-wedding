import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './shared/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'wedding',
    loadComponent: () => import('./pages/wedding/wedding.component').then(m => m.WeddingComponent),
  },
  {
    path: 'kedvencek',
    loadComponent: () => import('./pages/kedvencek/kedvencek.component').then(m => m.KedvencekComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration/registration.component').then(m => m.RegistrationComponent),
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'wedding/:id',
    loadComponent: () => import('./pages/wedding/wedding-details/wedding-details.component').then(m => m.WeddingDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./shared/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
  },
];
