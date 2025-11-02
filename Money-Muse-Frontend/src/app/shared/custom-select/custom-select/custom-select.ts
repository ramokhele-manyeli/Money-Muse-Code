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

  ngOnInit() {
    this.updateSelectedOption();
  }

  ngOnChanges() {
    this.updateSelectedOption();
  }

  private updateSelectedOption() {
    this.selectedOption = this.options.find(option => option.value === this.value) || null;
  }

  toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.isOpen = true;
    this.isOpening = true;
    setTimeout(() => {
      this.isOpening = false;
    }, 200);
  }

  closeDropdown() {
    this.isClosing = true;
    setTimeout(() => {
      this.isOpen = false;
      this.isClosing = false;
    }, 150);
  }

  selectOption(option: SelectOption) {
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
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      this.closeDropdown();
    }
  }

  @HostListener('focus')
  onFocus() {
    this.isFocused = true;
  }

  @HostListener('blur')
  onBlur() {
    setTimeout(() => {
      this.isFocused = false;
    }, 100);
  }

  trackByValue(index: number, option: SelectOption): string {
    return option.value;
  }
}