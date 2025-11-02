import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule,
  Download,
  Trash2,
  AlertTriangle,
  Database,
} from 'lucide-angular';
import { Navbar } from "../../../navbar";
import { DeleteModal } from "../../../../shared/delete-modal/delete-modal/delete-modal";

interface DeleteItem {
  id: number;
  name: string;
  type?: string;
}

@Component({
  selector: 'app-data-management',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Navbar, DeleteModal],
  templateUrl: './data-management.html',
  styleUrl: './data-management.scss',
})
export class DataManagement implements OnInit {
  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/data-management';

  // Icons
  readonly Download = Download;
  readonly Trash2 = Trash2;
  readonly AlertTriangle = AlertTriangle;
  readonly Database = Database;

  // Delete modal state
  showDeleteModal = false;
  isDeleting = false;
  accountItem: DeleteItem = {
    id: 1,
    name: 'User Account',
    type: 'Complete account with all data'
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

  // Data management handlers
  onExportData(): void {
    console.log('Exporting data...');
    
    // Simulate data export process
    const userData = {
      transactions: [], // Add actual transaction data
      budgets: [], // Add actual budget data
      goals: [], // Add actual goals data
      preferences: {}, // Add user preferences
      exportDate: new Date().toISOString()
    };

    // Create and download JSON file
    const jsonData = JSON.stringify(userData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `money-muse-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success message (you can implement a toast notification)
    alert('Data export started! Your download should begin shortly.');
  }

  onShowDeleteModal(): void {
    this.showDeleteModal = true;
  }

  onCloseDeleteModal(): void {
    this.showDeleteModal = false;
    this.isDeleting = false;
  }

  onConfirmDeleteAccount(item: DeleteItem): void {
    this.isDeleting = true;
    console.log('Deleting account...', item);
    
    // Add account deletion logic here
    // This would typically involve:
    // 1. API call to delete user account
    // 2. Clear local storage
    // 3. Redirect to auth page
    
    // Simulate the deletion process with a delay
    setTimeout(() => {
      // Clear all user data
      localStorage.clear();
      
      // Close modal and reset state
      this.onCloseDeleteModal();
      
      // Redirect to auth page
      this.router.navigate(['/auth']);
      
      // Show success message
      alert('Account deleted successfully. You will be redirected to the login page.');
    }, 2000); // 2 second delay to show loading state
  }
}
