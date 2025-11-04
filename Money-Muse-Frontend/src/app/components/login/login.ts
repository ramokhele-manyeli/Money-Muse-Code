import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoginDto } from '../../DTOs/auth.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    
    const loginDto: LoginDto = {
      email,
      password
    };

    this.authService.login(loginDto).subscribe({
      next: (result) => {
        console.log('Login successful:', result);
        if (result.token) {
          this.authService.setToken(result.token);
          
          // Debug: Decode the token
          try {
            const payload = JSON.parse(atob(result.token.split('.')[1]));
            console.log('🔍 Token payload:', payload);
            console.log('👤 User ID:', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
            console.log('👤 Username:', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
            console.log('🎭 Role:', payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
            console.log('📅 Expires:', new Date(payload.exp * 1000));
            console.log('🏢 Issuer:', payload.iss);
            console.log('🎯 Audience:', payload.aud);
          } catch (e) {
            console.error('❌ Error decoding token:', e);
          }
        }
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Helper method to mark all fields as touched for validation display
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Getter methods for easy access to form validation in template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
