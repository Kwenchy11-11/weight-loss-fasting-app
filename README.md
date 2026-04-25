# Fasting Tracker - OMAD & Warrior Diet

A Progressive Web App (PWA) for tracking intermittent fasting with support for OMAD (One Meal A Day) and Warrior Diet (20:4) fasting protocols. Features push notifications, weight tracking with charts, calorie calculations, and Excel export.

## Features

- **Fasting Timer**: Track OMAD (23:1) and Warrior Diet (20:4) fasting schedules with real-time countdown
- **Push Notifications**: Get notified when your fasting window ends
- **Weight Tracking**: Log daily weight with visual charts showing progress over time
- **Calorie Calculator**: Calculate BMR, TDEE, and daily calorie targets based on your goals
- **Excel Export**: Download your fasting and weight data for analysis
- **PWA Support**: Install on iPhone, iPad, or Android for a native app experience
- **User Authentication**: Secure login system with encrypted passwords

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Charts**: Recharts
- **Excel Export**: SheetJS (xlsx)
- **Push Notifications**: Web Push API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weight-loss-fasting-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your values:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
```

Generate VAPID keys for push notifications:
```bash
npx web-push generate-vapid-keys
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Fasting Timer

1. Navigate to the Fasting Timer page
2. Select your fasting mode (OMAD or Warrior Diet)
3. Click "Start Fasting" to begin
4. The timer will count down to your target end time
5. Receive a push notification when your fast is complete

### Weight Tracking

1. Go to the Weight Tracking page
2. Enter your current weight and optional notes
3. View your progress on the chart
4. See statistics like total change, average weight, and min/max values

### Calorie Calculator

1. Visit the Calorie Calculator page
2. Enter your weight, height, age, and gender
3. Select your activity level and goal (lose/maintain/gain)
4. Get your BMR, TDEE, and target daily calories

### Data Export

1. Go to the Export Data page
2. Choose to export all data, fasting only, or weight only
3. Download the Excel file for use in spreadsheet applications

### Installing as PWA

**iPhone/iPad:**
1. Open Safari and navigate to the app
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will appear on your home screen

**Android:**
1. Open Chrome and navigate to the app
2. Tap the menu (three dots)
3. Select "Add to Home screen" or "Install app"

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── export/       # Excel export
│   │   ├── fasting/      # Fasting session management
│   │   ├── push/         # Push notification subscriptions
│   │   └── weight/       # Weight log management
│   ├── dashboard/        # Dashboard pages
│   │   ├── calculator/   # Calorie calculator
│   │   ├── export/       # Data export page
│   │   ├── fasting/      # Fasting timer
│   │   ├── notifications/# Notification settings
│   │   └── weight/       # Weight tracking
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── service-worker-registration.tsx
│   └── sign-out-button.tsx
├── hooks/               # Custom React hooks
│   └── use-push-notifications.ts
├── lib/                 # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   └── push-notification.ts # Web Push setup
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
│   ├── icons/           # PWA icons
│   ├── manifest.json    # Web app manifest
│   └── sw.js            # Service worker
└── types/               # TypeScript types
    └── next-auth.d.ts   # NextAuth type extensions
```

## Database Schema

### User
- id, email, name, password, createdAt, updatedAt

### FastingSession
- id, userId, mode (OMAD/WARRIOR), startTime, targetEndTime, endTime, duration, isActive

### WeightLog
- id, userId, weight, date, notes

### PushSubscription
- id, userId, endpoint, p256dh, auth

## API Endpoints

- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth authentication
- `GET/POST/PATCH /api/fasting` - Manage fasting sessions
- `GET/POST/DELETE /api/weight` - Manage weight logs
- `GET/POST/DELETE /api/push/subscribe` - Push notification subscriptions
- `GET /api/export` - Export data as Excel

## Development

### Adding New Features

1. Create API route in `app/api/`
2. Create page component in `app/dashboard/`
3. Add navigation link in `app/dashboard/layout.tsx`
4. Update database schema in `prisma/schema.prisma` if needed
5. Run `npx prisma migrate dev` to apply changes

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name <migration-name>

# Reset database
npx prisma migrate reset

# View database with Prisma Studio
npx prisma studio
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Self-Hosting

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Browser Support

- Chrome/Edge (recommended for push notifications)
- Safari (iOS 16.4+ for push notifications)
- Firefox

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
