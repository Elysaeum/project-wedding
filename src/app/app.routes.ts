import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'wedding',
    loadComponent: () => import('./pages/wedding/wedding.component').then(m => m.WeddingComponent)
  },
  {
    path: 'kedvencek',
    loadComponent: () => import('./pages/kedvencek/kedvencek.component').then(m => m.KedvencekComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('./pages/registration/registration.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'wedding/:id',
    loadComponent: () => import('./pages/wedding/wedding-details/wedding-details.component').then(m => m.WeddingDetailsComponent)
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
