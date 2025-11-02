import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Plus,
  Target,
  Trash2,
  Calendar,
  TrendingUp,
  DollarSign,
  Home,
  Zap,
  Smartphone,
  Car,
  Coffee,
  ShoppingBag,
} from 'lucide-angular';
import { Navbar } from '../../navbar/navbar';
import { SavingsGoalsModal } from '../../savings-goals-modal/savings-goals-modal/savings-goals-modal';

interface SavingsGoal {
  id: string;
  icon: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

interface MetricData {
  id: number;
  label: string;
  value: string;
  icon: any;
  changeType: 'positive' | 'negative';
}

@Component({
  selector: 'app-savings-goals',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, Navbar, FormsModule, SavingsGoalsModal],
  templateUrl: './savings-goals.html',
  styleUrl: './savings-goals.scss',
})
export class SavingsGoals implements OnInit {
  // Icons
  readonly Plus = Plus;
  readonly Target = Target;
  readonly Trash2 = Trash2;
  readonly Calendar = Calendar;
  readonly TrendingUp = TrendingUp;
  readonly DollarSign = DollarSign;

  // Expose Math to template
  readonly Math = Math;

  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/savings-goals';

  // Modal states
  isCreateModalOpen = false;
  isAddMoneyModalOpen = false;
  selectedGoalId: string | null = null;
  showConfetti = false;

  // Form data for add money modal
  addMoneyAmount = '';

  // Goals data
  goals: SavingsGoal[] = [
    {
      id: '1',
      icon: '🏠',
      title: 'House Down Payment',
      targetAmount: 50000,
      currentAmount: 32500,
      deadline: '2025-12-31',
      color: '#10b981',
    },
    {
      id: '2',
      icon: '✈️',
      title: 'Dream Vacation',
      targetAmount: 5000,
      currentAmount: 3200,
      deadline: '2025-08-15',
      color: '#3b82f6',
    },
    {
      id: '3',
      icon: '🚗',
      title: 'New Car',
      targetAmount: 25000,
      currentAmount: 8500,
      deadline: '2026-06-30',
      color: '#f59e0b',
    },
    {
      id: '4',
      icon: '💍',
      title: 'Wedding Fund',
      targetAmount: 15000,
      currentAmount: 15000,
      deadline: '2025-05-20',
      color: '#ec4899',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
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

  // Computed properties
  get totalGoals(): number {
    return this.goals.length;
  }

  get totalSaved(): number {
    return this.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  }

  get totalTarget(): number {
    return this.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  }

  get overallProgress(): number {
    return this.totalTarget > 0 ? (this.totalSaved / this.totalTarget) * 100 : 0;
  }

  get metricsData(): MetricData[] {
    return [
      {
        id: 1,
        label: 'Total Goals',
        value: `${this.totalGoals}`,
        icon: this.Target,
        changeType: 'positive',
      },
      {
        id: 2,
        label: 'Total Saved',
        value: `$${this.totalSaved.toFixed(2)}`,
        icon: this.DollarSign,
        changeType: 'positive',
      },
      {
        id: 3,
        label: 'Total Target',
        value: `$${this.totalTarget.toFixed(2)}`,
        icon: this.TrendingUp,
        changeType: 'positive',
      },
    ];
  }

  // Goal management
  onCreateGoal(goalData: any): void {
    const goal: SavingsGoal = {
      id: Date.now().toString(),
      icon: goalData.icon,
      title: goalData.title,
      targetAmount: goalData.targetAmount,
      currentAmount: 0,
      deadline: goalData.deadline,
      color: goalData.color,
    };

    this.goals.unshift(goal);
  }

  handleDeleteGoal(id: string): void {
    this.goals = this.goals.filter(goal => goal.id !== id);
  }

  openAddMoneyModal(goalId: string): void {
    this.selectedGoalId = goalId;
    this.isAddMoneyModalOpen = true;
  }

  handleAddMoney(): void {
    if (!this.selectedGoalId || !this.addMoneyAmount) return;

    const amount = Number.parseFloat(this.addMoneyAmount);
    this.goals = this.goals.map(goal => {
      if (goal.id === this.selectedGoalId) {
        const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        const wasIncomplete = goal.currentAmount < goal.targetAmount;
        const isNowComplete = newAmount >= goal.targetAmount;

        // Trigger confetti if goal just completed
        if (wasIncomplete && isNowComplete) {
          this.triggerConfetti();
        }

        return { ...goal, currentAmount: newAmount };
      }
      return goal;
    });

    this.addMoneyAmount = '';
    this.isAddMoneyModalOpen = false;
    this.selectedGoalId = null;
  }

  // Utility methods
  getProgress(goal: SavingsGoal): number {
    return (goal.currentAmount / goal.targetAmount) * 100;
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 100) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (percentage >= 75) return 'bg-gradient-to-r from-green-400 to-green-600';
    if (percentage >= 50) return 'bg-gradient-to-r from-blue-400 to-blue-600';
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
  }

  isGoalCompleted(goal: SavingsGoal): boolean {
    return goal.currentAmount >= goal.targetAmount;
  }

  getRemainingAmount(goal: SavingsGoal): number {
    return Math.max(goal.targetAmount - goal.currentAmount, 0);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Modal handlers
  onCreateModalClose(): void {
    this.isCreateModalOpen = false;
  }

  onCreateModalSave(goalData: any): void {
    this.onCreateGoal(goalData);
  }

  onAddMoneyModalClose(): void {
    this.isAddMoneyModalOpen = false;
    this.selectedGoalId = null;
    this.addMoneyAmount = '';
  }

  triggerConfetti(): void {
    this.showConfetti = true;
    setTimeout(() => {
      this.showConfetti = false;
    }, 3000);
  }

  // Get selected goal for add money modal
  get selectedGoal(): SavingsGoal | null {
    return this.goals.find(goal => goal.id === this.selectedGoalId) || null;
  }

  // Track by functions for performance
  trackByGoalId(index: number, goal: SavingsGoal): string {
    return goal.id;
  }

  trackByMetricId(index: number, metric: MetricData): number {
    return metric.id;
  }

  // Track by function for confetti array
  trackByIndex(index: number, item: number): number {
    return index;
  }

  // Generate array for confetti
  getConfettiArray(): number[] {
    return Array.from({ length: 50 }, (_, i) => i);
  }
}
