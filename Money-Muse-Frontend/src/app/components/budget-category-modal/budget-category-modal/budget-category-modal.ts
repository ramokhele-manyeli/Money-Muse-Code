import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Check } from 'lucide-angular';

interface BudgetCategoryData {
  name: string;
  icon: string;
  budget: number;
  spent: number;
  color: string;
}

@Component({
  selector: 'app-budget-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './budget-category-modal.html',
  styleUrl: './budget-category-modal.scss',
})
export class BudgetCategoryModal {
  @Input() isOpen = false;
  @Input() editingCategory: any = null; // For edit mode
  @Input() isEditMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<BudgetCategoryData>();

  // Icons - expose to template
  readonly X = X;
  readonly Check = Check;

  // Form model
  categoryData = {
    name: '',
    icon: 'other',
    budget: 0,
    spent: 0,
    color: 'bg-blue-500'
  };

  availableColors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-orange-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-gray-500'
  ];

  availableIcons = [
    { value: 'food', label: 'Food & Dining', emoji: '🍽️' },
    { value: 'transport', label: 'Transport', emoji: '🚗' },
    { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
    { value: 'bills', label: 'Bills & Utilities', emoji: '🏠' },
    { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { value: 'healthcare', label: 'Healthcare', emoji: '🏥' },
    { value: 'education', label: 'Education', emoji: '🎓' },
    { value: 'fitness', label: 'Fitness', emoji: '💪' },
    { value: 'travel', label: 'Travel', emoji: '✈️' },
    { value: 'other', label: 'Other', emoji: '⭐' }
  ];

  ngOnChanges(): void {
    if (this.isEditMode && this.editingCategory) {
      this.categoryData = {
        name: this.editingCategory.name,
        icon: this.editingCategory.icon,
        budget: this.editingCategory.budget,
        spent: this.editingCategory.spent,
        color: this.editingCategory.color
      };
    } else {
      this.reset();
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  onSave(): void {
    if (!this.categoryData.name || this.categoryData.budget <= 0) return;
    
    const data: BudgetCategoryData = {
      ...this.categoryData,
      budget: Number(this.categoryData.budget),
      spent: Number(this.categoryData.spent)
    };

    this.save.emit(data);
    this.reset();
    this.closeModal();
  }

  reset(): void {
    this.categoryData = {
      name: '',
      icon: 'other',
      budget: 0,
      spent: 0,
      color: 'bg-blue-500'
    };
  }

  selectColor(color: string): void {
    this.categoryData.color = color;
  }

  selectIcon(icon: string): void {
    this.categoryData.icon = icon;
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  getIconEmoji(iconValue: string): string {
    const icon = this.availableIcons.find(i => i.value === iconValue);
    return icon ? icon.emoji : '⭐';
  }

  getColorPreview(color: string): string {
    const colorMap: Record<string, string> = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#10b981',
      'bg-orange-500': '#f97316',
      'bg-purple-500': '#8b5cf6',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1',
      'bg-yellow-500': '#f59e0b',
      'bg-red-500': '#ef4444',
      'bg-gray-500': '#6b7280'
    };
    return colorMap[color] || '#3b82f6';
  }
}
