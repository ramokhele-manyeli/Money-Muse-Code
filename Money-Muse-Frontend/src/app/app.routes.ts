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
        path: 'transactions',
        loadComponent: () => import('./components/transaction/transaction/transaction').then(m => m.Transaction)
    },
    {
        path: 'user-security',
        loadComponent: () => import('./components/settings/user-security/user-security/user-security').then(m => m.UserSecurity)
    },
    {
        path: 'user-preference',
        loadComponent: () => import('./components/settings/user-preferences/user-preferences/user-preferences').then(m => m.UserPreferences)
    },
    {
        path: 'data-management',
        loadComponent: () => import('./components/settings/data-management/data-management/data-management').then(m => m.DataManagement)
    },
    {
        path: 'user-profile',
        loadComponent: () => import('./components/settings/user-profile/user-profile/user-profile').then(m => m.UserProfile)
    },
    {
        path: 'savings-goals',
        loadComponent: () => import('./components/savings-goals/savings-goals/savings-goals').then(m => m.SavingsGoals)
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
