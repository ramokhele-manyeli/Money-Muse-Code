## 💰 Money Muse

## A modern personal finance management application that helps users track income, expenses, budgets, and savings goals with unique features like reality check insights, time machine simulator, and intelligent subscription detection.

## 🚀 Features

### Core
- **Transaction Management** – Log income and expenses with categorized tracking

- **Budget Planning** – Create monthly budgets and monitor real-time progress

- **Savings Goals** – Set goals with targets and deadlines

- **Receipt Scanner** – Use OCR to quickly record expenses from photos

- **Recurring Transactions** – Automate repetitive income or expense entries

### Stand-Out Features
- ⏰ **Time Machine Simulator** - Simulate "what if" scenarios from past spending decisions
- 🧠 **Money Personality Quiz** - Personalized financial insights based on your spending archetype
- 💡 **Reality Check Insights** - See spending converted to work hours and opportunity costs
- 🔍 **Smart Subscription Detector** - Automatically identify and track recurring subscriptions
- 💯 **Financial Health Score** - Gamified scoring system with improvement tips
- 👥 **Bill Splitting** - Split expenses with friends and roommates
- 🔔 **Custom Alerts** - Set personalized spending alerts and reminders
- 📈 **Advanced Analytics** - Beautiful data visualizations with spending trends

## 🛠️ Tech Stack

### Backend
- **Framework**: ASP.NET Core 8 Web API
- **Database**: SQL Server
- **ORM**: Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Background Jobs**: Hangfire
- **Real-Time**: SignalR
- **Logging**: Serilog
- **Validation**: FluentValidation
- **Mapping**: AutoMapper

### Frontend
- **Framework**: Angular 18+
- **Styling**: SCSS / Tailwind CSS
- **State Management**: RxJS
- **Charts**: Chart.js / D3.js
- **HTTP Client**: Angular HttpClient

### Third-Party Services
- **OCR**: Azure Computer Vision API / Tesseract.js
- **Email**: SendGrid
- **File Storage**: Azure Blob Storage
- **PDF Generation**: QuestPDF

## 📁 Project Structure
```
Money-Muse-Code/
├── Money-Muse-Backend/        # ASP.NET Core Web API
│   ├── Controllers/           # API endpoints
│   ├── Services/              # Business logic layer
│   ├── Repositories/          # Data access layer
│   ├── Models/                # Entity models
│   ├── DTOs/                  # Data transfer objects
│   ├── Middleware/            # Custom middleware
│   └── BackgroundJobs/        # Hangfire jobs
│
└── Money-Muse-Frontend/       # Angular application
    ├── src/
    │   ├── app/
    │   │   ├── components/    # Reusable components
    │   │   ├── pages/         # Page components
    │   │   ├── services/      # API services
    │   │   ├── guards/        # Route guards
    │   │   ├── interceptors/  # HTTP interceptors
    │   │   └── models/        # TypeScript interfaces
    │   └── assets/            # Static assets
    └── angular.json
```

## 🔧 Setup Instructions

### Prerequisites
- .NET 8 SDK
- Node.js (v18+)
- SQL Server (LocalDB or Express)
- Angular CLI: `npm install -g @angular/cli`

### Backend Setup

1. Navigate to backend directory:
```bash
cd Money-Muse-Backend
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Update connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MoneyMuse;Trusted_Connection=true;"
  }
}
```

4. Run database migrations:
```bash
dotnet ef database update
```

5. Run the API:
```bash
dotnet run
```

API will be available at: `https://localhost:7001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd Money-Muse-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api'
};
```

4. Run the development server:
```bash
ng serve
```

Application will be available at: `http://localhost:4200`

## 🔐 Environment Variables

Create a `.env` file in the backend root:
```env
JWT_SECRET=your-super-secret-jwt-key-here
JWT_ISSUER=MoneyMuse
JWT_AUDIENCE=MoneyMuseUsers
SENDGRID_API_KEY=your-sendgrid-api-key
AZURE_STORAGE_CONNECTION_STRING=your-azure-storage-connection
AZURE_COMPUTER_VISION_KEY=your-azure-cv-key
AZURE_COMPUTER_VISION_ENDPOINT=your-azure-cv-endpoint
```

## 📊 Database Schema

The application uses 15 core tables:
- Users
- Transactions
- Categories
- Budgets
- SavingsGoals
- SavingsContributions
- RecurringTransactions
- BillSplitGroups
- BillSplitGroupMembers
- BillSplitExpenses
- BillSplitExpenseSplits
- UserAlerts
- Notifications
- FinancialHealthScores
- Subscriptions


## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome!

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 👤 Author

**Your Name**
- GitHub: [@ramokhele-manyeli](https://github.com/ramokhele-manyeli)

## 🙏 Acknowledgments

- Built with ASP.NET Core and Angular
- Inspired by modern fintech applications

⭐ If you find this project helpful, please give it a star!
