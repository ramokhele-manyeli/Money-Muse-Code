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
  Info,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-angular';
import { Navbar } from '../../navbar/navbar';
import { CustomSelect } from '../../../shared/custom-select/custom-select/custom-select';
import { DeleteModal } from '../../../shared/delete-modal/delete-modal/delete-modal';
import { CategoryModal } from '../../category-modal/category-modal/category-modal';

interface CategoryModel {
  id: string;
  name: string;
  icon: string;
  colorCode: string; // Changed from 'color' to 'colorCode'
  type: 'Income' | 'Expense' | 'Both';
  description?: string;
  transactionCount: number;
  isSystem?: boolean;
}

interface MetricData {
  id: number;
  label: string;
  value: string;
  icon: any;
  change?: string;
  changeType: 'positive' | 'negative';
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, Navbar, FormsModule, CustomSelect, DeleteModal, CategoryModal],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category implements OnInit {
  // Icons
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly Info = Info;
  readonly FileText = FileText;
  readonly DollarSign = DollarSign;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;

  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/categories';

  // Filter and tab state
  searchQuery = '';
  activeTab: 'custom' | 'system' = 'custom';
  currentPage = 1;
  itemsPerPage = 8;

  // Modal states
  isModalOpen = false;
  isDeleteModalOpen = false;
  editingCategory: CategoryModel | null = null;
  deleteCategory: CategoryModel | null = null;
  isDeleting = false;

  // Form data
  formData = {
    name: '',
    icon: '🍔',
    colorCode: '#3b82f6', // Changed from 'color' to 'colorCode'
    type: 'Expense' as 'Income' | 'Expense' | 'Both',
    description: ''
  };

  errors: { name?: boolean } = {};

  // Icon and color options
  iconOptions = ['🍔', '🚗', '🎬', '💡', '🛒', '🏥', '✈️', '🏠', '📱', '💰', '🎓', '🎮', '☕', '🏋️', '🎨', '📚'];
  colorOptions = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // System categories (read-only)
  systemCategories: CategoryModel[] = [
    {
      id: 'sys-1',
      name: 'Food & Dining',
      icon: '🍔',
      colorCode: '#f59e0b', // Changed from 'color' to 'colorCode'
      type: 'Expense',
      transactionCount: 45,
      isSystem: true,
    },
    {
      id: 'sys-2',
      name: 'Transport',
      icon: '🚗',
      colorCode: '#3b82f6',
      type: 'Expense',
      transactionCount: 32,
      isSystem: true,
    },
    {
      id: 'sys-3',
      name: 'Entertainment',
      icon: '🎬',
      colorCode: '#8b5cf6',
      type: 'Expense',
      transactionCount: 28,
      isSystem: true,
    },
    {
      id: 'sys-4',
      name: 'Bills & Utilities',
      icon: '💡',
      colorCode: '#ef4444',
      type: 'Expense',
      transactionCount: 12,
      isSystem: true,
    },
    {
      id: 'sys-5',
      name: 'Shopping',
      icon: '🛒',
      colorCode: '#ec4899',
      type: 'Expense',
      transactionCount: 56,
      isSystem: true,
    },
    {
      id: 'sys-6',
      name: 'Healthcare',
      icon: '🏥',
      colorCode: '#10b981',
      type: 'Expense',
      transactionCount: 8,
      isSystem: true,
    },
    {
      id: 'sys-7',
      name: 'Travel',
      icon: '✈️',
      colorCode: '#14b8a6',
      type: 'Expense',
      transactionCount: 15,
      isSystem: true,
    },
    {
      id: 'sys-8',
      name: 'Salary',
      icon: '💰',
      colorCode: '#10b981',
      type: 'Income',
      transactionCount: 24,
      isSystem: true,
    },
  ];

  // Custom categories (user created)
  customCategories: CategoryModel[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.loadCustomCategories();
  }

  // Load custom categories from localStorage
  loadCustomCategories(): void {
    const saved = localStorage.getItem('customCategories');
    if (saved) {
      this.customCategories = JSON.parse(saved);
    }
  }

  // Save custom categories to localStorage
  saveCustomCategories(): void {
    localStorage.setItem('customCategories', JSON.stringify(this.customCategories));
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

  // Tab handling
  setActiveTab(tab: 'custom' | 'system'): void {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  // Category handlers
  handleAddCategory(): void {
    this.editingCategory = null;
    this.formData = {
      name: '',
      icon: '🍔',
      colorCode: '#3b82f6', // Changed from 'color' to 'colorCode'
      type: 'Expense',
      description: ''
    };
    this.errors = {};
    this.isModalOpen = true;
  }

  handleEditCategory(category: CategoryModel): void {
    if (category.isSystem) return; // Cannot edit system categories
    
    this.editingCategory = category;
    this.formData = {
      name: category.name,
      icon: category.icon,
      colorCode: category.colorCode, // Changed from 'color' to 'colorCode'
      type: category.type,
      description: category.description || ''
    };
    this.errors = {};
    this.isModalOpen = true;
  }

  handleDeleteCategory(category: CategoryModel): void {
    if (category.isSystem) return; // Cannot delete system categories
    
    this.deleteCategory = category;
    this.isDeleteModalOpen = true;
  }

  // Modal handlers
  onModalClose(): void {
    this.isModalOpen = false;
    this.editingCategory = null;
    this.errors = {};
  }

  onSaveCategory(categoryData: any): void {
    console.log('Category saved:', categoryData);
    
    if (this.editingCategory) {
      // Update existing category
      const index = this.customCategories.findIndex(c => c.id === this.editingCategory!.id);
      if (index > -1) {
        this.customCategories[index] = {
          ...this.customCategories[index],
          ...categoryData
        };
      }
    } else {
      // Add new category
      const newCategory: CategoryModel = {
        id: `custom-${Date.now()}`,
        ...categoryData,
        transactionCount: 0
      };
      this.customCategories.push(newCategory);
    }

    this.saveCustomCategories();
    this.onModalClose();
  }

  // Delete modal handlers
  onDeleteModalClose(): void {
    this.isDeleteModalOpen = false;
    this.deleteCategory = null;
    this.isDeleting = false;
  }

  onConfirmDelete(item: any): void {
    if (this.deleteCategory) {
      this.isDeleting = true;
      
      // Simulate API call delay
      setTimeout(() => {
        const index = this.customCategories.findIndex(c => c.id === this.deleteCategory!.id);
        if (index > -1) {
          this.customCategories.splice(index, 1);
          this.saveCustomCategories();
        }
        this.onDeleteModalClose();
      }, 1000);
    }
  }

  // Helper method to get delete modal data - Fixed to match DeleteItem interface
  get deleteModalData() {
    if (!this.deleteCategory) return null;
    
    return {
      id: parseInt(this.deleteCategory.id.replace('custom-', '')) || 0, // Convert string ID to number for DeleteItem compatibility
      name: this.deleteCategory.name,
      type: `${this.deleteCategory.type} Category`
    };
  }

  // Filtered categories based on search and active tab
  get filteredCategories(): CategoryModel[] {
    const categories = this.activeTab === 'custom' ? this.customCategories : this.systemCategories;
    return categories.filter(c => 
      c.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredCategories.length / this.itemsPerPage);
  }

  get paginatedCategories(): CategoryModel[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

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

  // Metrics data
  get metricsData(): MetricData[] {
    const allCategories = [...this.customCategories, ...this.systemCategories];
    const mostUsedCategory = allCategories.sort((a, b) => b.transactionCount - a.transactionCount)[0];
    const unusedCategories = this.customCategories.filter(c => c.transactionCount === 0).length;

    return [
      {
        id: 1,
        label: 'Total Custom Categories',
        value: `${this.customCategories.length}`,
        icon: this.FileText,
        changeType: 'positive',
      },
      {
        id: 2,
        label: 'Most Used Category',
        value: mostUsedCategory ? mostUsedCategory.name : 'None',
        icon: this.TrendingUp,
        changeType: 'positive',
      },
      {
        id: 3,
        label: 'Unused Categories',
        value: `${unusedCategories}`,
        icon: this.TrendingDown,
        changeType: unusedCategories > 0 ? 'negative' : 'positive',
      },
      {
        id: 4,
        label: 'System Categories',
        value: `${this.systemCategories.length}`,
        icon: this.DollarSign,
        changeType: 'positive',
      },
    ];
  }

  // Utility methods
  getCategoryBackgroundColor(colorCode: string): string {
    return colorCode + '20'; // Add transparency
  }

  getCategoryTypeClass(type: string): string {
    switch (type) {
      case 'Income':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Expense':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Both':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  trackByCategoryId(index: number, category: CategoryModel): string {
    return category.id;
  }

  trackByMetricId(index: number, metric: MetricData): number {
    return metric.id;
  }

  // Form methods
  selectIcon(icon: string): void {
    this.formData.icon = icon;
  }

  selectColor(colorCode: string): void {
    this.formData.colorCode = colorCode; // Changed from 'color' to 'colorCode'
  }

  setType(type: 'Income' | 'Expense' | 'Both'): void {
    this.formData.type = type;
  }
}
