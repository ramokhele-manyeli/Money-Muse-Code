import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule, 
  ArrowUpRight,
  DollarSign,
  TrendingDown,
  ShoppingBag,
  Car,
  Coffee,
  Zap,
  Wallet,
  TrendingUp
} from 'lucide-angular';
import { Navbar } from '../../navbar/navbar';

interface MetricData {
  id: number;
  label: string;
  value: string;
  icon: any;
  change: string;
  changeType: 'positive' | 'negative';
}

interface Transaction {
  id: number;
  icon: any;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface IncomeExpenseData {
  month: string;
  income: number;
  expenses: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // Icons
  readonly ArrowUpRight = ArrowUpRight;
  readonly DollarSign = DollarSign;
  readonly TrendingDown = TrendingDown;
  readonly ShoppingBag = ShoppingBag;
  readonly Car = Car;
  readonly Coffee = Coffee;
  readonly Zap = Zap;
  readonly Wallet = Wallet;
  readonly TrendingUp = TrendingUp;

  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/dashboard';

  // Dashboard metrics
  totalBalance = 24750;
  monthlyIncome = 6200;
  monthlyExpenses = 4500;
  savingsRate = (((this.monthlyIncome - this.monthlyExpenses) / this.monthlyIncome) * 100).toFixed(1);

  // Enhanced metrics data
  metricsData: MetricData[] = [
    {
      id: 1,
      label: 'Total Balance',
      value: `$${this.totalBalance.toLocaleString()}`,
      icon: this.Wallet,
      change: '+12.5% from last month',
      changeType: 'positive'
    },
    {
      id: 2,
      label: 'Monthly Income',
      value: `$${this.monthlyIncome.toLocaleString()}`,
      icon: this.TrendingUp,
      change: '+8.2% from last month',
      changeType: 'positive'
    },
    {
      id: 3,
      label: 'Monthly Expenses',
      value: `$${this.monthlyExpenses.toLocaleString()}`,
      icon: this.TrendingDown,
      change: '+5.1% from last month',
      changeType: 'negative'
    },
    {
      id: 4,
      label: 'Savings Rate',
      value: `${this.savingsRate}%`,
      icon: this.DollarSign,
      change: '+2.3% from last month',
      changeType: 'positive'
    }
  ];

  // Chart data
  incomeExpenseData: IncomeExpenseData[] = [
    { month: 'Jan', income: 5200, expenses: 3800 },
    { month: 'Feb', income: 5400, expenses: 4100 },
    { month: 'Mar', income: 5100, expenses: 3900 },
    { month: 'Apr', income: 5800, expenses: 4300 },
    { month: 'May', income: 5600, expenses: 4000 },
    { month: 'Jun', income: 6200, expenses: 4500 },
  ];

  // Updated category data with green-themed colors
  categoryData: CategoryData[] = [
    { name: 'Housing', value: 1200, color: '#059669' }, // Primary green
    { name: 'Food', value: 600, color: '#10b981' }, // Secondary green
    { name: 'Transportation', value: 400, color: '#34d399' }, // Light green
    { name: 'Utilities', value: 300, color: '#6ee7b7' }, // Lighter green
    { name: 'Entertainment', value: 250, color: '#a7f3d0' }, // Very light green
    { name: 'Other', value: 750, color: '#d1fae5' }, // Pale green
  ];

  recentTransactions: Transaction[] = [
    { id: 1, icon: Coffee, description: 'Starbucks Coffee', amount: -5.5, date: '2025-02-01', type: 'expense' },
    { id: 2, icon: DollarSign, description: 'Salary Deposit', amount: 5200, date: '2025-02-01', type: 'income' },
    { id: 3, icon: ShoppingBag, description: 'Amazon Purchase', amount: -89.99, date: '2025-01-31', type: 'expense' },
    { id: 4, icon: Car, description: 'Gas Station', amount: -45.0, date: '2025-01-30', type: 'expense' },
    { id: 5, icon: Zap, description: 'Electric Bill', amount: -120.0, date: '2025-01-29', type: 'expense' },
  ];

  constructor(private router: Router) {
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

  formatAmount(amount: number): string {
    const formatted = Math.abs(amount).toFixed(2);
    return amount >= 0 ? `+$${formatted}` : `-$${formatted}`;
  }

  getTotalCategorySpending(): number {
    return this.categoryData.reduce((sum, cat) => sum + cat.value, 0);
  }

  getCategoryPercentage(value: number): number {
    const total = this.getTotalCategorySpending();
    return Math.round((value / total) * 100);
  }

  getCategoryRotation(index: number): string {
    let rotationAngle = 0;
    
    // Calculate cumulative rotation based on previous categories
    for (let i = 0; i < index; i++) {
      const percentage = this.categoryData[i].value / this.getTotalCategorySpending();
      rotationAngle += percentage * 360;
    }
    
    return `rotate(${rotationAngle} 100 100)`;
  }

  // Track by function for performance
  trackByMetricId(index: number, metric: MetricData): number {
    return metric.id;
  }
}