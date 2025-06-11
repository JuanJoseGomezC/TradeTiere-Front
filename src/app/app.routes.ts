import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'advertisment/:id',
    loadComponent: () => import('./pages/advertisment/advertisment.component').then(m => m.AdvertismentComponent)
  },
  {
    path: 'public-profile/:id',
    loadComponent: () => import('./pages/public-profile/public-profile.component').then(m => m.PublicProfileComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
