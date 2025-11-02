import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from localStorage (you might want to move this to a proper auth service method)
  const token = localStorage.getItem('token');
  
  if (!token) {
    return next(req);
  }
  
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const header = JSON.parse(atob(tokenParts[0]));
      const payload = JSON.parse(atob(tokenParts[1]));
      
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const originalRole = payload[roleClaim];
      
      if (originalRole === 'Super Admin') {
        let headers = req.headers;
        headers = headers.set('Authorization', `Bearer ${token}`);
        headers = headers.set('X-User-Role', 'SuperAdmin');
        
        const modifiedReq = req.clone({ headers });
        
        return next(modifiedReq);
      }
    }
  } catch (e) {
    console.error('[AuthInterceptor] Failed to process token:', e);
  }
  
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
  
  return next(authReq);
};
