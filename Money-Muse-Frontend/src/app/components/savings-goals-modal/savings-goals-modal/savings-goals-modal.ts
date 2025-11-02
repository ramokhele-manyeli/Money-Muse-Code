import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Check } from 'lucide-angular';

@Component({
  selector: 'app-savings-goals-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './savings-goals-modal.html',
  styleUrl: './savings-goals-modal.scss',
})
export class SavingsGoalsModal {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  // Icons - expose to template
  readonly X = X;
  readonly Check = Check;

  // simple form model (keeps parity with savings-goals component)
  newGoal = {
    icon: '🎯',
    title: '',
    targetAmount: '',
    deadline: '',
    color: '#10b981',
  };

  availableColors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
  availableIcons = ['🎯', '🏠', '✈️', '🚗', '💍', '💰', '📱', '🎓', '⚡', '☕'];

  closeModal() {
    this.close.emit();
  }

  onSave() {
    if (!this.newGoal.title || !this.newGoal.targetAmount || !this.newGoal.deadline) return;
    this.save.emit({
      ...this.newGoal,
      id: Date.now().toString(),
      targetAmount: Number(this.newGoal.targetAmount),
      currentAmount: 0,
    });
    this.reset();
    this.closeModal();
  }

  reset() {
    this.newGoal = { icon: '🎯', title: '', targetAmount: '', deadline: '', color: '#10b981' };
  }

  selectColor(color: string) {
    this.newGoal.color = color;
  }

  selectIcon(icon: string) {
    this.newGoal.icon = icon;
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) this.closeModal();
  }
}
