import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule,
  Upload,
  Camera,
  User,
} from 'lucide-angular';
import { Navbar } from "../../../navbar";
import { UserProfile as UserProfileModel } from '../../../../models/user-profile';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, Navbar],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/user-profile';

  // Icons
  readonly Upload = Upload;
  readonly Camera = Camera;
  readonly User = User;

  // User profile data
  profile: UserProfileModel = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '', // Will be set to uploaded image URL
    initials: 'JD'
  };

  // Form state
  originalProfile: UserProfileModel = { ...this.profile };
  isFormDirty = false;

  // File upload state
  selectedFile: File | null = null;
  avatarPreview: string | null = null;

  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.loadUserProfile();
    this.originalProfile = { ...this.profile };
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

  // Profile management
  private loadUserProfile(): void {
    // Load user profile from localStorage or API
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.profile = { ...this.profile, ...JSON.parse(savedProfile) };
    }
    
    // Update initials when profile loads
    this.updateInitials();
  }

  private saveUserProfile(): void {
    // Save profile to localStorage or API
    localStorage.setItem('userProfile', JSON.stringify(this.profile));
    this.originalProfile = { ...this.profile };
    this.checkFormDirty();
  }

  private updateInitials(): void {
    const names = this.profile.name.trim().split(' ');
    if (names.length >= 2) {
      this.profile.initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
    } else if (names.length === 1 && names[0]) {
      this.profile.initials = names[0][0].toUpperCase();
    } else {
      this.profile.initials = 'U';
    }
  }

  private checkFormDirty(): void {
    this.isFormDirty = (
      this.profile.name !== this.originalProfile.name ||
      this.profile.email !== this.originalProfile.email ||
      this.selectedFile !== null
    );
  }

  // Form event handlers
  onNameChange(): void {
    this.updateInitials();
    this.checkFormDirty();
  }

  onEmailChange(): void {
    this.checkFormDirty();
  }

  // File upload handlers
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type and size
      if (!this.isValidImageFile(file)) {
        alert('Please select a valid image file (JPG, PNG, or GIF) under 2MB.');
        return;
      }

      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
        this.checkFormDirty();
      };
      reader.readAsDataURL(file);
    }
  }

  onUploadPhoto(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/png,image/gif';
    fileInput.onchange = (event) => this.onFileSelect(event);
    fileInput.click();
  }

  onTakePhoto(): void {
    // This would typically open camera access
    // For now, we'll show an alert
    alert('Camera functionality would be implemented here. This requires camera permissions and WebRTC API.');
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  // Save profile
  onSaveChanges(): void {
    if (!this.isFormDirty) {
      return;
    }

    console.log('Saving profile...', this.profile);

    // If there's a selected file, upload it first
    if (this.selectedFile) {
      this.uploadAvatarImage().then((avatarUrl) => {
        this.profile.avatar = avatarUrl;
        this.saveUserProfile();
        this.resetFileState();
        this.showSuccessMessage();
      }).catch((error) => {
        console.error('Avatar upload failed:', error);
        alert('Failed to upload avatar. Please try again.');
      });
    } else {
      this.saveUserProfile();
      this.showSuccessMessage();
    }
  }

  private async uploadAvatarImage(): Promise<string> {
    // Simulate file upload - in real app, this would upload to server/cloud storage
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.selectedFile) {
          // In real implementation, this would return the actual uploaded file URL
          resolve(this.avatarPreview || '');
        } else {
          reject('No file selected');
        }
      }, 1000);
    });
  }

  private resetFileState(): void {
    this.selectedFile = null;
    this.avatarPreview = null;
  }

  private showSuccessMessage(): void {
    alert('Profile updated successfully!');
  }

  // Getters
  get displayAvatar(): string {
    return this.avatarPreview || this.profile.avatar || '';
  }

  get hasAvatar(): boolean {
    return !!(this.displayAvatar);
  }
}
