import { Component, Input, Output, EventEmitter, OnInit, OnChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.scss',
})

export class CustomSelect implements OnInit, OnChanges {
  @Input() options: SelectOption[] = [];
  @Input() value: string = '';
  @Input() placeholder: string = 'Select an option';
  @Output() valueChange = new EventEmitter<string>();

  readonly ChevronDown = ChevronDown;
  
  isOpen = false;
  isFocused = false;
  isOpening = false;
  isClosing = false;
  selectedOption: SelectOption | null = null;
  // Add stronger state management flags
  private preventStateChange = false;
  private isInteracting = false;

  ngOnInit() {
    this.updateSelectedOption();
  }

  ngOnChanges() {
    this.updateSelectedOption();
  }

  private updateSelectedOption() {
    this.selectedOption = this.options.find(option => option.value === this.value) || null;
  }

  toggleDropdown(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (this.preventStateChange || this.isInteracting) return;
    
    this.isInteracting = true;
    
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
    
    setTimeout(() => {
      this.isInteracting = false;
    }, 100);
  }

  closeDropdown() {
    if (this.isClosing || this.preventStateChange) return;
    
    this.isClosing = true;
    this.preventStateChange = true;
    
    // Force immediate state change instead of relying on animation
    this.isOpen = false;
    
    setTimeout(() => {
      this.isClosing = false;
      this.preventStateChange = false;
    }, 50); // Reduced timeout
  }

  openDropdown() {
    if (this.isOpening || this.preventStateChange || this.isOpen) return;
    
    this.isOpening = true;
    this.preventStateChange = true;
    this.isOpen = true;
    
    setTimeout(() => {
      this.isOpening = false;
      this.preventStateChange = false;
    }, 50); // Reduced timeout
  }

  selectOption(option: SelectOption, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (this.preventStateChange || this.isInteracting) return;
    
    this.selectedOption = option;
    this.valueChange.emit(option.value);
    this.closeDropdown();
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        }
        break;
      case 'Escape':
        if (this.isOpen) {
          this.closeDropdown();
        }
        break;
    }
  }

  onOptionKeyDown(event: KeyboardEvent, option: SelectOption) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectOption(option);
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.preventStateChange || this.isInteracting) return;
    
    const target = event.target as HTMLElement;
    const selectElement = target.closest('.custom-select');
    
    // Only close if clicked outside AND dropdown is actually open
    if (!selectElement && this.isOpen) {
      this.closeDropdown();
    }
  }

  trackByValue(index: number, option: SelectOption): string {
    return option.value;
  }
}