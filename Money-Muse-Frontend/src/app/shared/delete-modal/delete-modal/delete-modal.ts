import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule,
  AlertTriangle,
  X,
  Trash2,
} from 'lucide-angular';

interface DeleteItem {
  id: number;
  name: string;
  type?: string;
}

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.scss',
})
export class DeleteModal {
  @Input() isOpen = false;
  @Input() item: DeleteItem | null = null;
  @Input() title = 'Delete Item';
  @Input() message = 'Are you sure you want to delete this item? This action cannot be undone.';
  @Input() confirmText = 'Delete';
  @Input() cancelText = 'Cancel';
  @Input() isLoading = false;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<DeleteItem>();

  // Icons
  readonly AlertTriangle = AlertTriangle;
  readonly X = X;
  readonly Trash2 = Trash2;

  onClose() {
    if (!this.isLoading) {
      this.closeModal.emit();
    }
  }

  onConfirm() {
    if (this.item && !this.isLoading) {
      this.confirmDelete.emit(this.item);
    }
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget && !this.isLoading) {
      this.onClose();
    }
  }
}
