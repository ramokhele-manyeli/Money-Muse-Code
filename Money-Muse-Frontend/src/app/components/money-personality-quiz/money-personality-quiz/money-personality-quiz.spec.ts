import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyPersonalityQuiz } from './money-personality-quiz';

describe('MoneyPersonalityQuiz', () => {
  let component: MoneyPersonalityQuiz;
  let fixture: ComponentFixture<MoneyPersonalityQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoneyPersonalityQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyPersonalityQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
