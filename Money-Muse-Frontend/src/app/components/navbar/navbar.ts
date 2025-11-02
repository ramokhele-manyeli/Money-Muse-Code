import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule, 
  Home, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  PieChart, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-angular';

export interface NavItem {
  icon: any;
  label: string;
  href: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  // Icons
  readonly Home = Home;
  readonly TrendingUp = TrendingUp;
  readonly Wallet = Wallet;
  readonly CreditCard = CreditCard;
  readonly PieChart = PieChart;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;

  @Input() isOpen = false;
  @Input() currentRoute = '/dashboard';
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() closeMenu = new EventEmitter<void>();
  @Output() navigateToRoute = new EventEmitter<string>();

  // Navigation items
  navItems: NavItem[] = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: TrendingUp, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Wallet, label: 'Accounts', href: '/dashboard/accounts' },
    { icon: CreditCard, label: 'Transactions', href: '/transactions' },
    { icon: PieChart, label: 'Budget', href: '/dashboard/budget' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  constructor(private router: Router) {}

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  onCloseMenu(): void {
    this.closeMenu.emit();
  }

  onNavigate(href: string): void {
    this.navigateToRoute.emit(href);
  }

  isActive(href: string): boolean {
    return this.currentRoute === href;
  }

  onLogout(): void {
    // Clear authentication tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Redirect to auth page
    this.router.navigate(['/auth']);
  }
}