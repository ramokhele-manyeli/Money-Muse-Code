import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule,
  Lock,
  Key,
} from 'lucide-angular';
import { Navbar } from "../../../navbar";

@Component({
  selector: 'app-user-security',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, Navbar],
  templateUrl: './user-security.html',
  styleUrl: './user-security.scss',
})
export class UserSecurity implements OnInit {
  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/user-security';

  // Icons
  readonly Lock = Lock;
  readonly Key = Key;

  // Form state
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Validation states
  touched = {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  };

  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  // Navigation event handlers
  onToggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onCloseMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onNavigate(href: string): void {
    this.currentRoute = href;
    this.onCloseMobileMenu();
    this.router.navigate([href]);
  }

  // Validation getters
  get isCurrentPasswordValid(): boolean {
    return this.currentPassword.length > 0;
  }

  get isNewPasswordValid(): boolean {
    return this.newPassword.length >= 8;
  }

  get isConfirmPasswordValid(): boolean {
    return this.confirmPassword === this.newPassword && this.confirmPassword.length > 0;
  }

  get isFormValid(): boolean {
    return this.isCurrentPasswordValid && this.isNewPasswordValid && this.isConfirmPasswordValid;
  }

  // Event handlers
  onCurrentPasswordBlur() {
    this.touched.currentPassword = true;
  }

  onNewPasswordBlur() {
    this.touched.newPassword = true;
  }

  onConfirmPasswordBlur() {
    this.touched.confirmPassword = true;
  }

  onChangePassword() {
    if (!this.isFormValid) {
      // Mark all fields as touched to show validation errors
      this.touched.currentPassword = true;
      this.touched.newPassword = true;
      this.touched.confirmPassword = true;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    console.log('Changing password...');
    // Add password change logic here
    
    // Reset form after successful change
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.touched = {
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    };
  }

  // Password strength indicator
  getPasswordStrength(): string {
    if (this.newPassword.length === 0) return '';
    if (this.newPassword.length < 6) return 'weak';
    if (this.newPassword.length < 10) return 'medium';
    return 'strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return '';
    }
  }
}
