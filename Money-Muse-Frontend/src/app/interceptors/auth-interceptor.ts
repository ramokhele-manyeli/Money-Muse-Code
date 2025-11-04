import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  console.log('🔍 Interceptor called for:', req.url);
  
  // Get token from auth service
  const token = authService.getToken();
  
  console.log('🎫 Token found:', token ? 'YES' : 'NO');
  
  // If no token, proceed without modification
  if (!token) {
    console.log('❌ No token - proceeding without auth');
    return next(req);
  }

  // Check if token is expired
  if (authService.isTokenExpired(token)) {
    console.log('⏰ Token expired - removing and proceeding without auth');
    authService.removeToken();
    return next(req);
  }

  // Add Authorization header to all requests to your API
  if (req.url.includes('localhost:7028')) {
    console.log('✅ Adding Authorization header to API request');
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('📋 Authorization header:', authReq.headers.get('Authorization'));
    return next(authReq);
  }

  console.log('🌐 Non-API request - proceeding without auth');
  // For non-API requests, proceed without modification
  return next(req);
};
