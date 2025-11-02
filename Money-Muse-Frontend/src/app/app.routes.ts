import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    {
        path: 'auth',
        loadComponent: () => import('./components/auth/auth/auth').then(m => m.Auth)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard/dashboard').then(m => m.Dashboard)
    },
    {
        path: 'login',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'register', 
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    // Catch-all route for 404 errors
    { path: '**', redirectTo: 'auth' }
];
