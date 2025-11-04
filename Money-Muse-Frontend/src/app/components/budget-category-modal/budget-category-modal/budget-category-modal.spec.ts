import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetCategoryModal } from './budget-category-modal';

describe('BudgetCategoryModal', () => {
  let component: BudgetCategoryModal;
  let fixture: ComponentFixture<BudgetCategoryModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetCategoryModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetCategoryModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
