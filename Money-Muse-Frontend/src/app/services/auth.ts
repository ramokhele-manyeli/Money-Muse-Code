import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { 
  RegisterDto, 
  LoginDto, 
  RefreshTokenDto, 
  LogoutDto, 
  ForgotPasswordDto, 
  ResetPasswordDto, 
  ResendVerificationDto,
  AuthResult 
} from '../DTOs/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Fix: Remove the duplicate /api
  private readonly baseUrl = `${environment.apiUrl}/auth`; // Changed from /api/auth

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.baseUrl}/register`, dto);
  }

  login(dto: LoginDto): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.baseUrl}/login`, dto);
  }

  refreshToken(dto: RefreshTokenDto): Observable<AuthResult> {
    return this.http.post<AuthResult>(`${this.baseUrl}/refresh-token`, dto);
  }

  logout(dto: LogoutDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, dto);
  }

  forgotPassword(dto: ForgotPasswordDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, dto);
  }

  resetPassword(dto: ResetPasswordDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, dto);
  }

  verifyEmail(token: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/verify-email`, { token });
  }

  resendVerification(dto: ResendVerificationDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/resend-verification`, dto);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;
    
    try {
      const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
