# FixKart Backend - Firebase Cloud Functions

Production-ready Firebase backend for FixKart - AI-Powered Home Service Platform.

## Tech Stack

- **Runtime**: Node.js 18
- **Framework**: Express.js 4.18
- **Database**: Cloud Firestore
- **Storage**: Firebase Cloud Storage
- **Authentication**: Firebase Auth
- **Payments**: Razorpay
- **AI**: OpenAI GPT-4, Google Cloud Vision
- **Communications**: Twilio (SMS), Nodemailer (Email)
- **Maps**: Google Maps Platform

## Project Structure

```
fixkart-backend/
├── functions/
│   ├── routes/
│   │   ├── auth.js          # Authentication (OTP, login, register)
│   │   ├── users.js         # User profile, addresses, favorites
│   │   ├── workers.js       # Worker profile, jobs, earnings
│   │   ├── services.js      # Service catalog, search, pricing
│   │   ├── bookings.js      # Booking CRUD, tracking, cancellation
│   │   ├── payments.js      # Razorpay integration, wallet
│   │   ├── reviews.js       # Review submission, moderation
│   │   ├── notifications.js # Push notifications, FCM
│   │   ├── ai.js           # AI assistant, image analysis
│   │   └── admin.js        # Admin dashboard, analytics
│   ├── index.js            # Main entry, triggers, scheduled functions
│   ├── package.json        # Dependencies
│   └── .env.example        # Environment variables template
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Firestore composite indexes
├── storage.rules           # Storage security rules
├── firebase.json           # Firebase configuration
└── .firebaserc            # Firebase project config
```

## Setup

### Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Blaze plan (for Cloud Functions)

### Installation

1. Clone the repository
2. Navigate to functions directory:
   ```bash
   cd fixkart-backend/functions
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy environment template:
   ```bash
   cp .env.example .env
   ```
5. Fill in your API keys and credentials in `.env`

### Firebase Setup

1. Login to Firebase:
   ```bash
   firebase login
   ```
2. Select your project:
   ```bash
   firebase use your-project-id
   ```
3. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules,firestore:indexes
   ```

### Local Development

1. Start Firebase emulators:
   ```bash
   firebase emulators:start
   ```
2. Functions will be available at `http://localhost:5001`

### Deployment

Deploy all functions:
```bash
firebase deploy --only functions
```

Deploy specific function:
```bash
firebase deploy --only functions:api
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Email login
- `POST /api/auth/register-worker` - Register worker

### Users
- `GET/PUT /api/users/profile` - User profile
- `GET/POST/PUT/DELETE /api/users/addresses` - Manage addresses
- `GET/POST/DELETE /api/users/favorites` - Manage favorites
- `GET /api/users/wallet` - Wallet balance

### Workers
- `GET/PUT /api/workers/profile` - Worker profile
- `GET /api/workers/jobs/new` - New job requests
- `POST /api/workers/jobs/:id/accept` - Accept job
- `GET /api/workers/earnings` - Earnings summary

### Services
- `GET /api/services/categories` - All categories
- `GET /api/services` - List services
- `GET /api/services/:id` - Service details
- `GET /api/services/search/:query` - Search services

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - User's bookings
- `GET /api/bookings/:id` - Booking details
- `POST /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/:id/track` - Track worker

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/wallet/pay` - Pay via wallet

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/service/:id` - Service reviews
- `POST /api/reviews/:id/helpful` - Mark helpful

### AI
- `POST /api/ai/chat` - AI assistant chat
- `POST /api/ai/smart-search` - AI-powered search
- `POST /api/ai/analyze-image` - Image analysis
- `POST /api/ai/estimate` - Service estimation
- `POST /api/ai/troubleshoot` - DIY troubleshooting

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/analytics` - Detailed analytics
- `GET/PUT /api/admin/users/:id` - Manage users
- `GET/PUT /api/admin/workers/:id` - Manage workers
- `POST /api/admin/services` - Create service
- `POST /api/admin/coupons` - Create coupon

## Firestore Triggers

- `onUserCreated` - Initialize user profile
- `onUserDeleted` - Cleanup user data
- `onBookingStatusChange` - Send notifications
- `onReviewCreated` - Update ratings
- `onPaymentComplete` - Process payment

## Scheduled Functions

- `sendBookingReminders` - Hourly booking reminders
- `generateDailyReport` - Daily analytics report

## Security

- All routes are protected with Firebase Auth
- Admin routes require admin role verification
- Firestore rules enforce document-level security
- Storage rules restrict file uploads by type and size
- Rate limiting on sensitive endpoints

## Environment Variables

See `.env.example` for all required environment variables:
- Firebase configuration
- Razorpay API keys
- OpenAI API key
- Twilio credentials
- SMTP settings
- Google Maps API key

## Support

For issues and questions, contact: support@fixkart.com
