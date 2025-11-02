import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsGoalsModal } from './savings-goals-modal';

describe('SavingsGoalsModal', () => {
  let component: SavingsGoalsModal;
  let fixture: ComponentFixture<SavingsGoalsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsGoalsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsGoalsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
