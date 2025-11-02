import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Zap,
  Smartphone,
  FileText,
  DollarSign,
} from 'lucide-angular';
import { Navbar } from '../../navbar/navbar';
import { Transaction as TransactionModel } from '../../../models/transaction';
import { CustomSelect } from '../../../shared/custom-select/custom-select/custom-select';
import { TransactionModal } from '../../transaction-modal/transaction-modal/transaction-modal';
import { DeleteModal } from '../../../shared/delete-modal/delete-modal/delete-modal';

interface MetricData {
  id: number;
  label: string;
  value: string;
  icon: any;
  change?: string;
  changeType: 'positive' | 'negative';
}

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, Navbar, FormsModule, CustomSelect, TransactionModal, DeleteModal],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss',
})
export class Transaction implements OnInit {
  // Icons
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly Calendar = Calendar;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly ShoppingBag = ShoppingBag;
  readonly Coffee = Coffee;
  readonly Car = Car;
  readonly Home = Home;
  readonly Zap = Zap;
  readonly Smartphone = Smartphone;
  readonly FileText = FileText;
  readonly DollarSign = DollarSign;

  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/transactions';

  // Filter states
  searchQuery = '';
  selectedCategory = 'All Categories';
  selectedType = 'all';
  currentPage = 1;
  itemsPerPage = 8;
  isModalOpen = false;
  editingTransaction: TransactionModel | null = null;

  // Add delete modal state
  isDeleteModalOpen = false;
  deleteTransaction: TransactionModel | null = null;
  isDeleting = false;

  // Data
  categories = ['All Categories', 'Income', 'Housing', 'Food', 'Transportation', 'Utilities', 'Other'];
  
  categoryColors: Record<string, string> = {
    Income: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Housing: 'bg-blue-100 text-blue-700 border-blue-200',
    Food: 'bg-orange-100 text-orange-700 border-orange-200',
    Transportation: 'bg-purple-100 text-purple-700 border-purple-200',
    Utilities: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Other: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  mockTransactions: TransactionModel[] = [
    {
      id: 1,
      date: '2025-02-01',
      description: 'Salary Deposit',
      category: 'Income',
      amount: 5200,
      type: 'income',
      icon: this.DollarSign,
    },
    {
      id: 2,
      date: '2025-02-01',
      description: 'Rent Payment',
      category: 'Housing',
      amount: -1200,
      type: 'expense',
      icon: this.Home,
    },
    {
      id: 3,
      date: '2025-01-31',
      description: 'Grocery Shopping',
      category: 'Food',
      amount: -156.43,
      type: 'expense',
      icon: this.ShoppingBag,
    },
    {
      id: 4,
      date: '2025-01-31',
      description: 'Coffee Shop',
      category: 'Food',
      amount: -5.5,
      type: 'expense',
      icon: this.Coffee,
    },
    {
      id: 5,
      date: '2025-01-30',
      description: 'Gas Station',
      category: 'Transportation',
      amount: -45.0,
      type: 'expense',
      icon: this.Car,
    },
    {
      id: 6,
      date: '2025-01-29',
      description: 'Electric Bill',
      category: 'Utilities',
      amount: -120.0,
      type: 'expense',
      icon: this.Zap,
    },
    {
      id: 7,
      date: '2025-01-28',
      description: 'Freelance Project',
      category: 'Income',
      amount: 850,
      type: 'income',
      icon: this.DollarSign,
    },
    {
      id: 8,
      date: '2025-01-27',
      description: 'Phone Bill',
      category: 'Utilities',
      amount: -65.0,
      type: 'expense',
      icon: this.Smartphone,
    },
    {
      id: 9,
      date: '2025-01-26',
      description: 'Restaurant Dinner',
      category: 'Food',
      amount: -78.5,
      type: 'expense',
      icon: this.Coffee,
    },
    {
      id: 10,
      date: '2025-01-25',
      description: 'Insurance Payment',
      category: 'Other',
      amount: -200,
      type: 'expense',
      icon: this.FileText,
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  // Filter transactions - Fixed the filtering logic
  get filteredTransactions(): TransactionModel[] {
    return this.mockTransactions.filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'All Categories' || transaction.category === this.selectedCategory;
      const matchesType = this.selectedType === 'all' || transaction.type === this.selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }

  // Calculate stats
  get totalTransactions(): number {
    return this.filteredTransactions.length;
  }

  get totalIncome(): number {
    return this.filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }

  get totalExpenses(): number {
    return Math.abs(
      this.filteredTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    );
  }

  get netBalance(): number {
    return this.totalIncome - this.totalExpenses;
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  }

  get paginatedTransactions(): TransactionModel[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTransactions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  // Transaction handlers
  handleAddTransaction(): void {
    this.editingTransaction = null;
    this.isModalOpen = true;
  }

  handleEditTransaction(transaction: TransactionModel): void {
    this.editingTransaction = transaction;
    this.isModalOpen = true;
  }

  // Update the delete handler
  handleDeleteTransaction(transaction: TransactionModel): void {
    this.deleteTransaction = transaction;
    this.isDeleteModalOpen = true;
  }

  // Modal handlers
  onModalClose(): void {
    this.isModalOpen = false;
    this.editingTransaction = null;
  }

  onSaveTransaction(transactionData: any): void {
    console.log('Transaction saved:', transactionData);
    
    if (this.editingTransaction) {
      // Update existing transaction
      const index = this.mockTransactions.findIndex(t => t.id === this.editingTransaction!.id);
      if (index > -1) {
        this.mockTransactions[index] = {
          ...this.mockTransactions[index],
          type: transactionData.type,
          amount: transactionData.type === 'expense' ? -transactionData.amount : transactionData.amount,
          description: transactionData.description,
          category: this.capitalizeFirst(transactionData.category),
          date: transactionData.date,
        };
      }
    } else {
      // Add new transaction
      const newTransaction: TransactionModel = {
        id: Math.max(...this.mockTransactions.map(t => t.id)) + 1,
        type: transactionData.type,
        amount: transactionData.type === 'expense' ? -transactionData.amount : transactionData.amount,
        description: transactionData.description,
        category: this.capitalizeFirst(transactionData.category),
        date: transactionData.date,
        icon: this.getCategoryIcon(transactionData.category),
      };
      this.mockTransactions.unshift(newTransaction);
    }

    this.onModalClose();
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getCategoryIcon(category: string): any {
    const iconMap: Record<string, any> = {
      income: this.DollarSign,
      housing: this.Home,
      food: this.Coffee,
      transportation: this.Car,
      utilities: this.Zap,
      shopping: this.ShoppingBag,
      other: this.Smartphone,
    };
    return iconMap[category] || this.DollarSign;
  }

  // Pagination handlers
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  // New: metrics as a getter so values stay in sync with filters
  get metricsData(): MetricData[] {
    return [
      {
        id: 1,
        label: 'Total Transactions',
        value: `${this.totalTransactions}`,
        icon: this.DollarSign,
        change: '',
        changeType: 'positive',
      },
      {
        id: 2,
        label: 'Income This Month',
        value: `$${this.totalIncome.toFixed(2)}`,
        icon: this.TrendingUp,
        change: '',
        changeType: 'positive',
      },
      {
        id: 3,
        label: 'Expenses This Month',
        value: `$${this.totalExpenses.toFixed(2)}`,
        icon: this.TrendingDown,
        change: '',
        changeType: 'negative',
      },
      {
        id: 4,
        label: 'Net Balance',
        value: `$${(this.netBalance).toFixed(2)}`,
        icon: this.DollarSign,
        change: '',
        changeType: this.netBalance >= 0 ? 'positive' : 'negative',
      },
    ];
  }

  // trackBy for metric cards
  trackByMetricId(index: number, metric: MetricData): number {
    return metric.id;
  }

  // Options for custom selects
  get categoryOptions() {
    return this.categories.map(category => ({
      value: category,
      label: category
    }));
  }

  get typeOptions() {
    return [
      { value: 'all', label: 'All Types' },
      { value: 'income', label: 'Income' },
      { value: 'expense', label: 'Expense' }
    ];
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  formatAmount(amount: number): string {
    return Math.abs(amount).toFixed(2);
  }

  getCategoryColorClass(category: string): string {
    return this.categoryColors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  }

  trackByTransactionId(index: number, transaction: TransactionModel): number {
    return transaction.id;
  }

  // Add delete modal handlers
  onDeleteModalClose(): void {
    this.isDeleteModalOpen = false;
    this.deleteTransaction = null;
    this.isDeleting = false;
  }

  onConfirmDelete(item: any): void {
    if (this.deleteTransaction) {
      this.isDeleting = true;
      
      // Simulate API call delay
      setTimeout(() => {
        const index = this.mockTransactions.findIndex(t => t.id === this.deleteTransaction!.id);
        if (index > -1) {
          this.mockTransactions.splice(index, 1);
        }
        this.onDeleteModalClose();
      }, 1000); // 1 second delay to show loading state
    }
  }

  // Helper method to get delete modal data
  get deleteModalData() {
    if (!this.deleteTransaction) return null;
    
    return {
      id: this.deleteTransaction.id,
      name: this.deleteTransaction.description,
      type: `${this.deleteTransaction.type} • ${this.deleteTransaction.category}`
    };
  }
}
