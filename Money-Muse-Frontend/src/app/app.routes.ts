import { Routes } from '@angular/router';

export const routes: Routes = [
    // Authentication & Initial Setup
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    {
        path: 'auth',
        loadComponent: () => import('./components/auth/auth/auth').then(m => m.Auth)
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

    // Core Financial Overview
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard/dashboard').then(m => m.Dashboard)
    },
    // Note: Analytics route missing - needs to be added when component is created

    // Financial Management
    // Note: Accounts route missing - needs to be added when component is created
    {
        path: 'transactions',
        loadComponent: () => import('./components/transaction/transaction/transaction').then(m => m.Transaction)
    },
    {
        path: 'category',
        loadComponent: () => import('./components/category/category/category').then(m => m.Category)
    },
    {
        path: 'budget',
        loadComponent: () => import('./components/budget/budget/budget').then(m => m.Budget)
    },
    {
        path: 'savings-goals',
        loadComponent: () => import('./components/savings-goals/savings-goals/savings-goals').then(m => m.SavingsGoals)
    },

    // Learning & Assessment
    {
        path: 'money-personality-quiz',
        loadComponent: () => import('./components/money-personality-quiz/money-personality-quiz/money-personality-quiz').then(m => m.MoneyPersonalityQuiz)
    },

    // User Management
    {
        path: 'user-profile',
        loadComponent: () => import('./components/settings/user-profile/user-profile/user-profile').then(m => m.UserProfile)
    },
    {
        path: 'user-preference',
        loadComponent: () => import('./components/settings/user-preferences/user-preferences/user-preferences').then(m => m.UserPreferences)
    },
    {
        path: 'user-security',
        loadComponent: () => import('./components/settings/user-security/user-security/user-security').then(m => m.UserSecurity)
    },
    {
        path: 'data-management',
        loadComponent: () => import('./components/settings/data-management/data-management/data-management').then(m => m.DataManagement)
    },

    // Catch-all route for 404 errors
    { path: '**', redirectTo: 'auth' }
];
