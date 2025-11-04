import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule,
  X,
  Check,
} from 'lucide-angular';

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

interface TouchedFields {
  name: boolean;
}

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './category-modal.html',
  styleUrl: './category-modal.scss',
})
export class CategoryModal implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() category: CategoryModel | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveCategory = new EventEmitter<any>();

  // Icons
  readonly X = X;
  readonly Check = Check;

  // Form data
  formData = {
    name: '',
    icon: '🍔',
    colorCode: '#3b82f6', // Changed from 'color' to 'colorCode'
    type: 'Expense' as 'Income' | 'Expense' | 'Both',
    description: ''
  };

  // Validation
  touched: TouchedFields = {
    name: false,
  };

  errors: { name?: boolean } = {};

  // Icon and color options
  iconOptions = ['🍔', '🚗', '🎬', '💡', '🛒', '🏥', '✈️', '🏠', '📱', '💰', '🎓', '🎮', '☕', '🏋️', '🎨', '📚'];
  colorOptions = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges() {
    if (this.category) {
      this.loadCategory();
    } else {
      this.resetForm();
    }
  }

  private resetForm() {
    this.formData = {
      name: '',
      icon: '🍔',
      colorCode: '#3b82f6',
      type: 'Expense',
      description: ''
    };
    this.touched = {
      name: false,
    };
    this.errors = {};
  }

  private loadCategory() {
    if (this.category) {
      this.formData = {
        name: this.category.name,
        icon: this.category.icon,
        colorCode: this.category.colorCode, // Changed from 'color' to 'colorCode'
        type: this.category.type,
        description: this.category.description || ''
      };
      this.touched = {
        name: false,
      };
      this.errors = {};
    }
  }

  // Validation getters
  get isNameValid(): boolean {
    return this.formData.name.trim().length > 0;
  }

  get isFormValid(): boolean {
    return this.isNameValid;
  }

  // Event handlers
  onNameBlur() {
    this.touched.name = true;
  }

  selectIcon(icon: string): void {
    this.formData.icon = icon;
  }

  selectColor(colorCode: string): void {
    this.formData.colorCode = colorCode; // Changed from 'color' to 'colorCode'
  }

  setType(type: 'Income' | 'Expense' | 'Both'): void {
    this.formData.type = type;
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

  // Modal actions
  onClose() {
    this.closeModal.emit();
  }

  onSave() {
    // Validate before saving
    if (!this.formData.name.trim()) {
      this.errors = { name: true };
      this.touched.name = true;
      return;
    }
    
    this.errors = {};

    if (!this.isFormValid) return;

    const categoryData = {
      name: this.formData.name.trim(),
      icon: this.formData.icon,
      colorCode: this.formData.colorCode, // Changed from 'color' to 'colorCode'
      type: this.formData.type,
      description: this.formData.description.trim(),
    };

    console.log('Saving category:', categoryData);
    this.saveCategory.emit(categoryData);
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
