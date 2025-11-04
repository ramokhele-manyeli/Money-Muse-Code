import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Share2, RefreshCw, Check } from 'lucide-angular';
import { Navbar } from '../../navbar/navbar';

interface QuizAnswer {
  text: string;
  icon: string;
  type: 'saver' | 'investor' | 'spender' | 'planner';
}

interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

interface PersonalityType {
  title: string;
  emoji: string;
  color: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
}

@Component({
  selector: 'app-money-personality-quiz',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Navbar, RouterModule],
  templateUrl: './money-personality-quiz.html',
  styleUrl: './money-personality-quiz.scss',
})
export class MoneyPersonalityQuiz implements OnInit {
  // Icons
  readonly Share2 = Share2;
  readonly RefreshCw = RefreshCw;
  readonly Check = Check;
  readonly Math = Math;

  // Navigation state
  isMobileMenuOpen = false;
  currentRoute = '/quiz';

  // Quiz state
  currentQuestion = 0;
  answers: string[] = [];
  showResults = false;
  selectedAnswer: number | null = null;

  quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "When you receive unexpected money, what's your first instinct?",
      answers: [
        { text: "Save it immediately for a rainy day", icon: "💰", type: "saver" },
        { text: "Invest it to grow my wealth", icon: "📈", type: "investor" },
        { text: "Treat myself to something nice", icon: "🛍️", type: "spender" },
        { text: "Create a detailed plan for how to use it", icon: "📊", type: "planner" },
      ],
    },
    {
      id: 2,
      question: "How do you feel about checking your bank balance?",
      answers: [
        { text: "I check it multiple times a day", icon: "👀", type: "planner" },
        { text: "I check it regularly, once a week", icon: "📅", type: "saver" },
        { text: "I avoid looking at it", icon: "🙈", type: "spender" },
        { text: "I only check when making big decisions", icon: "🤔", type: "investor" },
      ],
    },
    {
      id: 3,
      question: "What's your approach to budgeting?",
      answers: [
        { text: "I have a detailed spreadsheet for everything", icon: "📝", type: "planner" },
        { text: "I follow the 50/30/20 rule loosely", icon: "⚖️", type: "saver" },
        { text: "Budget? What budget?", icon: "🤷", type: "spender" },
        { text: "I focus on growing income, not limiting spending", icon: "💡", type: "investor" },
      ],
    },
    {
      id: 4,
      question: "How do you handle sales and discounts?",
      answers: [
        { text: "I buy things I need when they're on sale", icon: "🎯", type: "saver" },
        { text: "I calculate if it's actually worth it", icon: "🧮", type: "planner" },
        { text: "I can't resist a good deal!", icon: "🤩", type: "spender" },
        { text: "I rarely shop for deals, time is money", icon: "⏰", type: "investor" },
      ],
    },
    {
      id: 5,
      question: "What's your biggest financial fear?",
      answers: [
        { text: "Not having enough saved for emergencies", icon: "😰", type: "saver" },
        { text: "Missing out on investment opportunities", icon: "📉", type: "investor" },
        { text: "Being too restrictive with my spending", icon: "😔", type: "spender" },
        { text: "Losing control of my finances", icon: "😨", type: "planner" },
      ],
    },
    {
      id: 6,
      question: "How do you celebrate achievements?",
      answers: [
        { text: "Put the bonus money straight into savings", icon: "🏦", type: "saver" },
        { text: "Reinvest in myself or my portfolio", icon: "📚", type: "investor" },
        { text: "Splurge on something I've been wanting", icon: "🎉", type: "spender" },
        { text: "Allocate it according to my financial plan", icon: "✅", type: "planner" },
      ],
    },
    {
      id: 7,
      question: "What's your relationship with credit cards?",
      answers: [
        { text: "I avoid them completely", icon: "🚫", type: "saver" },
        { text: "I use them strategically for rewards", icon: "💳", type: "planner" },
        { text: "I use them freely and worry later", icon: "😅", type: "spender" },
        { text: "I use them to leverage opportunities", icon: "🎰", type: "investor" },
      ],
    },
    {
      id: 8,
      question: "How do you research big purchases?",
      answers: [
        { text: "Weeks of research and comparison shopping", icon: "🔍", type: "planner" },
        { text: "I look for the best value option", icon: "💵", type: "saver" },
        { text: "Quick decision based on what I like", icon: "⚡", type: "spender" },
        { text: "I consider the ROI and long-term value", icon: "📊", type: "investor" },
      ],
    },
    {
      id: 9,
      question: "What's your retirement planning strategy?",
      answers: [
        { text: "Maxing out all retirement accounts", icon: "🎯", type: "saver" },
        { text: "Diversified investment portfolio", icon: "🌐", type: "investor" },
        { text: "I'll think about it later", icon: "🤔", type: "spender" },
        { text: "Detailed plan with specific milestones", icon: "📈", type: "planner" },
      ],
    },
    {
      id: 10,
      question: "How do you feel about financial advice?",
      answers: [
        { text: "I seek it out constantly", icon: "🎓", type: "planner" },
        { text: "I prefer to research and learn myself", icon: "📖", type: "investor" },
        { text: "I trust my instincts", icon: "💫", type: "spender" },
        { text: "I follow proven, conservative strategies", icon: "🛡️", type: "saver" },
      ],
    },
  ];

  personalityTypes: Record<string, PersonalityType> = {
    saver: {
      title: "The Savvy Saver",
      emoji: "🏦",
      color: "from-green-400 to-emerald-600",
      description: "You're a financial fortress! Your natural instinct is to save and protect your money. You find comfort in watching your savings grow and always have a safety net ready.",
      strengths: [
        "Excellent at building emergency funds",
        "Rarely stressed about unexpected expenses",
        "Great at delayed gratification",
        "Strong financial security mindset",
      ],
      weaknesses: [
        "May miss out on investment opportunities",
        "Can be overly cautious with spending",
        "Might sacrifice experiences for savings",
        "May struggle to enjoy money earned",
      ],
      tips: [
        "Consider allocating a small percentage for 'fun money' guilt-free",
        "Explore low-risk investment options to grow your savings",
        "Set specific savings goals to make it more rewarding",
        "Remember that experiences can be valuable investments too",
      ],
    },
    investor: {
      title: "The Investment Guru",
      emoji: "📈",
      color: "from-blue-400 to-indigo-600",
      description: "You're always thinking about the future! You see money as a tool for growth and aren't afraid to take calculated risks. Your focus is on building wealth over time.",
      strengths: [
        "Strong understanding of compound growth",
        "Comfortable with calculated risks",
        "Long-term thinking and planning",
        "Proactive about wealth building",
      ],
      weaknesses: [
        "May overlook short-term financial needs",
        "Can be too focused on returns",
        "Might take unnecessary risks",
        "May neglect liquid emergency funds",
      ],
      tips: [
        "Maintain 3-6 months of expenses in liquid savings",
        "Diversify your portfolio to manage risk",
        "Don't forget to enjoy some money in the present",
        "Review and rebalance investments regularly",
      ],
    },
    spender: {
      title: "The Spontaneous Spender",
      emoji: "🛍️",
      color: "from-pink-400 to-rose-600",
      description: "You live in the moment and believe money is meant to be enjoyed! You value experiences and aren't afraid to treat yourself. Life is too short not to have fun!",
      strengths: [
        "Great at enjoying life and creating memories",
        "Not overly stressed about money",
        "Generous with friends and family",
        "Knows how to celebrate achievements",
      ],
      weaknesses: [
        "May struggle with long-term savings",
        "Can face unexpected financial stress",
        "Might have impulse buying habits",
        "May lack emergency fund cushion",
      ],
      tips: [
        "Set up automatic savings before you see the money",
        "Use the 24-hour rule for non-essential purchases",
        "Create a 'fun money' budget to spend guilt-free",
        "Start small with savings goals to build momentum",
      ],
    },
    planner: {
      title: "The Budget Master",
      emoji: "📊",
      color: "from-purple-400 to-violet-600",
      description: "You're a financial strategist! Every dollar has a purpose, and you love the control that comes with detailed planning. Your spreadsheets are works of art!",
      strengths: [
        "Excellent at tracking and categorizing expenses",
        "Strong awareness of financial position",
        "Great at meeting financial goals",
        "Prepared for various scenarios",
      ],
      weaknesses: [
        "Can be too rigid with budgets",
        "May stress over small variances",
        "Might miss spontaneous opportunities",
        "Can overthink financial decisions",
      ],
      tips: [
        "Build in flexibility for unexpected joys",
        "Don't let perfect be the enemy of good",
        "Automate routine financial tasks to reduce stress",
        "Remember that life happens outside the spreadsheet",
      ],
    },
  };

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

  get currentQuestionData(): QuizQuestion {
    return this.quizQuestions[this.currentQuestion];
  }

  get progress(): number {
    return ((this.currentQuestion + 1) / this.quizQuestions.length) * 100;
  }

  get currentPersonality(): PersonalityType | null {
    if (!this.showResults) return null;
    const personalityKey = this.calculatePersonality();
    return this.personalityTypes[personalityKey];
  }

  handleAnswer(answerType: string, answerIndex: number): void {
    this.selectedAnswer = answerIndex;
    
    setTimeout(() => {
      const newAnswers = [...this.answers, answerType];
      this.answers = newAnswers;

      if (this.currentQuestion < this.quizQuestions.length - 1) {
        this.currentQuestion++;
        this.selectedAnswer = null;
      } else {
        this.showResults = true;
      }
    }, 300);
  }

  calculatePersonality(): string {
    const counts: Record<string, number> = {};
    this.answers.forEach((answer) => {
      counts[answer] = (counts[answer] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }

  resetQuiz(): void {
    this.currentQuestion = 0;
    this.answers = [];
    this.showResults = false;
    this.selectedAnswer = null;
  }

  async shareResults(): Promise<void> {
    const personality = this.currentPersonality;
    if (!personality) return;

    const text = `I just discovered I'm "${personality.title}" ${personality.emoji}! Take the Money Personality Quiz to find your financial archetype!`;
    
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: "Money Personality Quiz", 
          text 
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Results copied to clipboard!");
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("Results copied to clipboard!");
    }
  }
}