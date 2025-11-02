import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule,
  Settings,
  DollarSign,
  Calendar,
  Moon,
} from 'lucide-angular';
import { Navbar } from "../../../navbar";
import { CustomSelect } from '../../../../shared/custom-select/custom-select/custom-select';

interface CurrencyOption {
  value: string;
  label: string;
  symbol: string;
}

interface DateFormatOption {
  value: string;
  label: string;
  example: string;
}

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-user-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, Navbar, CustomSelect],
  templateUrl: './user-preferences.html',
  styleUrl: './user-preferences.scss',
})
export class UserPreferences implements OnInit {
  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/user-preferences';

  // Icons
  readonly Settings = Settings;
  readonly DollarSign = DollarSign;
  readonly Calendar = Calendar;
  readonly Moon = Moon;

  // Preferences state
  currency = 'USD';
  dateFormat = 'MM/DD/YYYY';
  darkMode = false;

  // Currency options
  currencyOptions: CurrencyOption[] = [
    { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
    { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
    { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
    { value: 'JPY', label: 'JPY - Japanese Yen', symbol: '¥' },
    { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: '$' },
  ];

  // Date format options
  dateFormatOptions: DateFormatOption[] = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/31/2024' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '31/12/2024' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2024-12-31' },
    { value: 'DD MMM YYYY', label: 'DD MMM YYYY', example: '31 Dec 2024' },
  ];

  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.loadPreferences();
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

  // Preference handlers
  onCurrencyChange(value: string): void {
    this.currency = value;
    this.savePreferences();
    console.log('Currency changed to:', value);
  }

  onDateFormatChange(value: string): void {
    this.dateFormat = value;
    this.savePreferences();
    console.log('Date format changed to:', value);
  }

  onDarkModeToggle(): void {
    this.darkMode = !this.darkMode;
    this.savePreferences();
    console.log('Dark mode toggled:', this.darkMode);
    
    // Apply dark mode to document
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Helper methods
  private loadPreferences(): void {
    // Load preferences from localStorage or API
    const savedCurrency = localStorage.getItem('userCurrency');
    const savedDateFormat = localStorage.getItem('userDateFormat');
    const savedDarkMode = localStorage.getItem('userDarkMode');

    if (savedCurrency) this.currency = savedCurrency;
    if (savedDateFormat) this.dateFormat = savedDateFormat;
    if (savedDarkMode) this.darkMode = savedDarkMode === 'true';

    // Apply dark mode if enabled
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    }
  }

  private savePreferences(): void {
    // Save preferences to localStorage or API
    localStorage.setItem('userCurrency', this.currency);
    localStorage.setItem('userDateFormat', this.dateFormat);
    localStorage.setItem('userDarkMode', this.darkMode.toString());
  }

  // Getters for CustomSelect component (formatted for SelectOption interface)
  get currencySelectOptions(): SelectOption[] {
    return this.currencyOptions.map(option => ({
      value: option.value,
      label: `${option.label} (${option.symbol})`
    }));
  }

  get dateFormatSelectOptions(): SelectOption[] {
    return this.dateFormatOptions.map(option => ({
      value: option.value,
      label: `${option.label} (${option.example})`
    }));
  }

  // Getters for display
  get selectedCurrencyLabel(): string {
    const selected = this.currencyOptions.find(option => option.value === this.currency);
    return selected ? selected.label : this.currency;
  }

  get selectedDateFormatLabel(): string {
    const selected = this.dateFormatOptions.find(option => option.value === this.dateFormat);
    return selected ? `${selected.label} (${selected.example})` : this.dateFormat;
  }
}
