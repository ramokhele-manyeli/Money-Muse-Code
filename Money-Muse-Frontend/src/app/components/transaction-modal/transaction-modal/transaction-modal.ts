import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Zap,
  Smartphone,
  DollarSign,
  Upload,
  X,
  Check,
  Calendar as CalendarIcon,
} from 'lucide-angular';
import { Transaction } from '../../../models/transaction';
import { CustomSelect } from '../../../shared/custom-select/custom-select/custom-select';

interface CategoryOption {
  value: string;
  label: string;
  icon: any;
  color: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface TouchedFields {
  amount: boolean;
  description: boolean;
  category: boolean;
}

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CustomSelect],
  templateUrl: './transaction-modal.html',
  styleUrl: './transaction-modal.scss',
})
export class TransactionModal implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() transaction: Transaction | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveTransaction = new EventEmitter<any>();

  // Icons
  readonly ShoppingBag = ShoppingBag;
  readonly Coffee = Coffee;
  readonly Car = Car;
  readonly Home = Home;
  readonly Zap = Zap;
  readonly Smartphone = Smartphone;
  readonly DollarSign = DollarSign;
  readonly Upload = Upload;
  readonly X = X;
  readonly Check = Check;
  readonly CalendarIcon = CalendarIcon;

  // Form data
  transactionType: 'income' | 'expense' = 'expense';
  amount = '';
  description = '';
  category = '';
  date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  isRecurring = false;
  receipt: File | null = null;
  isDragging = false;

  // Validation
  touched: TouchedFields = {
    amount: false,
    description: false,
    category: false,
  };

  categories: CategoryOption[] = [
    { value: 'income', label: 'Income', icon: this.DollarSign, color: 'text-emerald-600' },
    { value: 'housing', label: 'Housing', icon: this.Home, color: 'text-blue-600' },
    { value: 'food', label: 'Food & Dining', icon: this.Coffee, color: 'text-orange-600' },
    { value: 'transportation', label: 'Transportation', icon: this.Car, color: 'text-purple-600' },
    { value: 'utilities', label: 'Utilities', icon: this.Zap, color: 'text-yellow-600' },
    { value: 'shopping', label: 'Shopping', icon: this.ShoppingBag, color: 'text-pink-600' },
    { value: 'other', label: 'Other', icon: this.Smartphone, color: 'text-gray-600' },
  ];

  // Convert categories to select options for CustomSelect
  get categorySelectOptions(): SelectOption[] {
    return this.categories.map(cat => ({
      value: cat.value,
      label: cat.label
    }));
  }

  ngOnInit() {
    this.resetForm();
  }

  ngOnChanges() {
    if (this.transaction) {
      this.loadTransaction();
    } else {
      this.resetForm();
    }
  }

  private resetForm() {
    this.transactionType = 'expense';
    this.amount = '';
    this.description = '';
    this.category = '';
    this.date = new Date().toISOString().split('T')[0];
    this.isRecurring = false;
    this.receipt = null;
    this.isDragging = false;
    this.touched = {
      amount: false,
      description: false,
      category: false,
    };
  }

  private loadTransaction() {
    if (this.transaction) {
      this.transactionType = this.transaction.type;
      this.amount = Math.abs(this.transaction.amount).toString();
      this.description = this.transaction.description;
      this.category = this.transaction.category.toLowerCase();
      this.date = this.transaction.date;
      this.isRecurring = false;
      this.receipt = null;
    }
  }

  // Validation getters
  get isAmountValid(): boolean {
    return this.amount !== '' && !isNaN(Number(this.amount)) && Number(this.amount) > 0;
  }

  get isDescriptionValid(): boolean {
    return this.description.trim().length > 0;
  }

  get isCategoryValid(): boolean {
    return this.category !== '';
  }

  get isFormValid(): boolean {
    return this.isAmountValid && this.isDescriptionValid && this.isCategoryValid;
  }

  // Event handlers
  onTransactionTypeChange(type: 'income' | 'expense') {
    this.transactionType = type;
  }

  onAmountBlur() {
    this.touched.amount = true;
  }

  onDescriptionBlur() {
    this.touched.description = true;
  }

  onCategoryChange(value: string) {
    this.category = value;
    this.touched.category = true;
  }

  // File upload handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.receipt = file;
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.receipt = file;
    }
  }

  removeReceipt() {
    this.receipt = null;
  }

  getReceiptUrl(): string {
    return this.receipt ? URL.createObjectURL(this.receipt) : '';
  }

  getReceiptSizeKB(): string {
    return this.receipt ? (this.receipt.size / 1024).toFixed(2) : '0';
  }

  // Modal actions
  onClose() {
    this.closeModal.emit();
  }

  onSave() {
    if (!this.isFormValid) return;

    const transactionData = {
      type: this.transactionType,
      amount: Number(this.amount),
      description: this.description,
      category: this.category,
      date: this.date,
      isRecurring: this.isRecurring,
      receipt: this.receipt,
    };

    console.log('Saving transaction:', transactionData);
    this.saveTransaction.emit(transactionData);
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getCategoryIcon(categoryValue: string): any {
    const category = this.categories.find(cat => cat.value === categoryValue);
    return category ? category.icon : this.DollarSign;
  }

  getCategoryColor(categoryValue: string): string {
    const category = this.categories.find(cat => cat.value === categoryValue);
    return category ? category.color : 'text-gray-600';
  }
}
