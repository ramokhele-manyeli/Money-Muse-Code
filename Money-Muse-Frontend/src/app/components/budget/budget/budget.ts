import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  ShoppingBag,
  Car,
  Film,
  Home,
  Utensils,
  Sparkles,
  Plus,
  Edit,
  Trash2
} from 'lucide-angular';
import { Navbar } from '../../navbar/navbar';
import { BudgetCategoryModal } from '../../budget-category-modal/budget-category-modal/budget-category-modal';
import { Router, RouterModule } from '@angular/router';
import { CategoriesService } from '../../../services/categories';
import { Category } from '../../../models/category';
import { CategoryCreateDto, CategoryUpdateDto } from '../../../DTOs/category.dto';
import { Subscription } from 'rxjs';

interface BudgetCategoryData {
  name: string;
  icon: string;
  budget: number;
  spent: number;
  color: string;
}

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, Navbar, RouterModule, BudgetCategoryModal],
  templateUrl: './budget.html',
  styleUrl: './budget.scss',
})
export class Budget implements OnInit, OnDestroy {
  // Icons
  readonly ShoppingBag = ShoppingBag;
  readonly Car = Car;
  readonly Film = Film;
  readonly Home = Home;
  readonly Utensils = Utensils;
  readonly Sparkles = Sparkles;
  readonly Plus = Plus;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;

  // Expose Math to template
  readonly Math = Math;

  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/budget';

  // Modal states
  isCreateModalOpen = false;
  isEditModalOpen = false;
  editingCategory: Category | null = null;

  // Categories data
  categories: Category[] = [];
  loading = false;

  // Subscriptions
  private categoriesSubscription?: Subscription;

  constructor(
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.loadCategories();
    this.subscribeToCategories();
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) {
      this.categoriesSubscription.unsubscribe();
    }
  }

  // Navigation handlers
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

  // Data loading methods
  loadCategories(): void {
    this.loading = true;

    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
        this.loading = false;
        this.categories = [];
      }
    });
  }

  subscribeToCategories(): void {
    this.categoriesSubscription = this.categoriesService.categories$.subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Categories subscription error:', error);
      }
    });
  }

  refreshCategories(): void {
    this.categoriesService.refresh().subscribe({
      next: () => {
        // Categories will be updated via subscription
      },
      error: (error) => {
        console.error('Failed to refresh categories:', error);
        // Remove the error property reference
      }
    });
  }

  // Computed properties
  get totalBudget(): number {
    return this.categories.reduce((sum, cat) => sum + cat.budget, 0);
  }

  get totalSpent(): number {
    return this.categories.reduce((sum, cat) => sum + cat.spent, 0);
  }

  get totalPercentage(): number {
    return this.totalBudget > 0 ? (this.totalSpent / this.totalBudget) * 100 : 0;
  }

  get healthScore(): number {
    if (this.totalBudget === 0) return 100;
    const percentage = (this.totalSpent / this.totalBudget) * 100;
    if (percentage <= 70) return 100;
    if (percentage <= 85) return 85;
    if (percentage <= 100) return 70;
    return Math.max(0, 50 - (percentage - 100));
  }

  get healthLabel(): string {
    const score = this.healthScore;
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  }

  get healthMessage(): string {
    const score = this.healthScore;
    if (score >= 85) return "Great job! You're managing your budget well.";
    if (score >= 70) return 'Good progress. Watch your spending in some categories.';
    return 'Consider reviewing your spending habits.';
  }

  // Utility methods
  getProgressColor(percentage: number): string {
    if (percentage <= 70) return 'bg-green-500';
    if (percentage <= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getHealthColor(score: number): string {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getCategoryIcon(iconName: string): any {
    const iconMap: Record<string, any> = {
      food: this.Utensils,
      transport: this.Car,
      entertainment: this.Film,
      bills: this.Home,
      shopping: this.ShoppingBag,
      healthcare: this.Plus,
      education: this.Film,
      fitness: this.Plus,
      travel: this.Car,
      other: this.Sparkles
    };
    return iconMap[iconName] || this.Sparkles;
  }

  getPercentage(category: Category): number {
    return category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
  }

  getRemaining(category: Category): number {
    return category.budget - category.spent;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  }

  // Category management with API calls
  onCreateCategory(categoryData: BudgetCategoryData): void {
    const dto: CategoryCreateDto = {
      name: categoryData.name,
      icon: categoryData.icon,
      budget: categoryData.budget,
      spent: categoryData.spent,
      color: categoryData.color
    };

    this.categoriesService.create(dto).subscribe({
      next: (createdCategory) => {
        console.log('Category created successfully:', createdCategory);
        // Category will be added to list via subscription
      },
      error: (error) => {
        console.error('Failed to create category:', error);
        // Just log the error, don't show UI error
      }
    });
  }

  handleEditCategory(category: Category): void {
    this.editingCategory = { ...category };
    this.isEditModalOpen = true;
  }

  onSaveEditCategory(categoryData: BudgetCategoryData): void {
    if (!this.editingCategory) return;

    const dto: CategoryUpdateDto = {
      name: categoryData.name,
      icon: categoryData.icon,
      budget: categoryData.budget,
      spent: categoryData.spent,
      color: categoryData.color
    };

    this.categoriesService.update(this.editingCategory.id, dto).subscribe({
      next: (updatedCategory) => {
        console.log('Category updated successfully:', updatedCategory);
        // Category will be updated in list via subscription
        this.editingCategory = null;
        this.isEditModalOpen = false;
      },
      error: (error) => {
        console.error('Failed to update category:', error);
        if (error.status === 404) {
          // Just refresh and close modal for 404 errors
          this.refreshCategories();
          this.isEditModalOpen = false;
          this.editingCategory = null;
        }
        // Don't show UI error, just log it
      }
    });
  }

  handleDeleteCategory(id: string): void {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    this.categoriesService.delete(id).subscribe({
      next: () => {
        console.log('Category deleted successfully');
        // Category will be removed from list via subscription
      },
      error: (error) => {
        console.error('Failed to delete category:', error);
        // Just log the error, don't show UI error
      }
    });
  }

  // Modal handlers
  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  onCreateModalClose(): void {
    this.isCreateModalOpen = false;
  }

  onEditModalClose(): void {
    this.isEditModalOpen = false;
    this.editingCategory = null;
  }

  onCreateModalSave(categoryData: BudgetCategoryData): void {
    const dto: CategoryCreateDto = {
      name: categoryData.name,
      icon: categoryData.icon,
      budget: categoryData.budget,
      spent: categoryData.spent,
      color: categoryData.color
    };

    this.categoriesService.create(dto).subscribe({
      next: (createdCategory) => {
        console.log('Category created successfully:', createdCategory);
        // Category will be added to list via subscription
        this.isCreateModalOpen = false; // Close modal on success
      },
      error: (error) => {
        console.error('Failed to create category:', error);
        // Just log the error, keep modal open so user can retry
      }
    });
  }

  // Track by functions
  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }
}
