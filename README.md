<<<<<<< HEAD
# FixKart - AI-Powered Home Service Platform

Complete production-ready home services platform with React frontend and Firebase backend.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool
- **Tailwind CSS 3** - Utility-first styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router v6** - Routing
- **React Hot Toast** - Notifications
- **Firebase SDK** - Auth, Firestore, Storage, FCM

### Backend
- **Firebase Functions** - Serverless backend
- **Express.js** - API routing
- **Firestore** - NoSQL database
- **Firebase Auth** - Authentication
- **Cloud Storage** - File storage

### Integrations
- **Razorpay** - Payments
- **Google Maps** - Location services
- **OpenAI GPT-4** - AI features
- **Google Vision** - Image analysis
- **Twilio** - SMS notifications
- **Nodemailer** - Email notifications
- **Firebase Cloud Messaging** - Push notifications

## 📁 Project Structure

```
fixkart/
├── fixkart-frontend/          # React frontend
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   ├── sw.js              # Service worker
│   │   └── firebase-messaging-sw.js
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/            # Button, Input, Card, etc.
│   │   │   ├── layout/        # Header, Footer, Layouts
│   │   │   ├── modals/        # Modal components
│   │   │   └── ai/            # AI Assistant
│   │   ├── pages/             # Route pages
│   │   │   ├── auth/          # Login, Signup, etc.
│   │   │   ├── services/      # Services catalog
│   │   │   ├── booking/       # Booking flow
│   │   │   ├── payment/       # Payment pages
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── worker/        # Worker portal
│   │   │   ├── admin/         # Admin panel
│   │   │   └── static/        # About, FAQ, etc.
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Zustand stores
│   │   ├── utils/             # Utility functions
│   │   └── config/            # Firebase config
│   ├── package.json
│   └── vite.config.js
│
└── fixkart-backend/           # Firebase backend
    ├── functions/
    │   ├── routes/            # API routes
    │   │   ├── auth.js
    │   │   ├── users.js
    │   │   ├── workers.js
    │   │   ├── services.js
    │   │   ├── bookings.js
    │   │   ├── payments.js
    │   │   ├── reviews.js
    │   │   ├── notifications.js
    │   │   ├── ai.js
    │   │   └── admin.js
    │   ├── middleware/        # Express middleware
    │   ├── services/          # Business services
    │   ├── utils/             # Helpers
    │   └── scripts/           # Seed data scripts
    ├── firestore.rules        # Security rules
    ├── storage.rules          # Storage rules
    └── firebase.json          # Firebase config
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/fixkart.git
cd fixkart
```

### 2. Frontend Setup
```bash
cd fixkart-frontend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Firebase config
# Start development server
npm run dev
```

### 3. Backend Setup
```bash
cd fixkart-backend/functions
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys
# Start Firebase emulators
firebase emulators:start
```

### 4. Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email, Google, Phone)
3. Create Firestore database
4. Enable Storage
5. Copy Firebase config to frontend .env
6. Deploy rules:
```bash
firebase deploy --only firestore:rules,storage:rules
```

### 5. Deploy
```bash
# Deploy backend
cd fixkart-backend
firebase deploy --only functions

# Build & deploy frontend
cd ../fixkart-frontend
npm run build
firebase deploy --only hosting
```

## 🔑 Environment Variables

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_RAZORPAY_KEY_ID=rzp_xxx
VITE_GOOGLE_MAPS_API_KEY=xxx
```

### Backend (.env)
```
OPENAI_API_KEY=sk-xxx
GOOGLE_VISION_API_KEY=xxx
RAZORPAY_KEY_ID=rzp_xxx
RAZORPAY_KEY_SECRET=xxx
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
SMTP_HOST=smtp.gmail.com
SMTP_USER=xxx@gmail.com
SMTP_PASS=xxx
```

## 📱 Features

### Customer Features
- 🏠 Browse 50+ home services
- 🤖 AI-powered service recommendations
- 📸 Photo-based issue detection
- 🗓️ Easy booking with slot selection
- 📍 Real-time worker tracking
- 💳 Razorpay payments
- 💰 Wallet system with cashback
- 📱 PWA with offline support
- 🔔 Push notifications

### Worker Features
- 📋 Job management dashboard
- 🗺️ Navigation to customer
- 💵 Earnings tracking
- ⭐ Rating system
- 🔔 Real-time job alerts

### Admin Features
- 📊 Analytics dashboard
- 👥 User management
- 👨‍🔧 Worker management
- 📦 Service catalog
- 💰 Payment reports
- 🗺️ Live worker map

## 📄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/services | List services |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/:id | Get booking |
| POST | /api/payments/create-order | Create Razorpay order |
| POST | /api/ai/chat | AI chat |
| POST | /api/ai/analyze-image | Image analysis |

## 📝 License

MIT License - Free for personal and commercial use.

## 🤝 Contributing

Pull requests welcome! Please read the contributing guidelines first.

## 📞 Support

- Email: support@fixkart.in
- Phone: 1800-123-4567
- Chat: In-app AI assistant
=======
# FixKart - AI-Powered Home Service Platform

Complete production-ready home services platform with React frontend and Firebase backend.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool
- **Tailwind CSS 3** - Utility-first styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router v6** - Routing
- **React Hot Toast** - Notifications
- **Firebase SDK** - Auth, Firestore, Storage, FCM

### Backend
- **Firebase Functions** - Serverless backend
- **Express.js** - API routing
- **Firestore** - NoSQL database
- **Firebase Auth** - Authentication
- **Cloud Storage** - File storage

### Integrations
- **Razorpay** - Payments
- **Google Maps** - Location services
- **OpenAI GPT-4** - AI features
- **Google Vision** - Image analysis
- **Twilio** - SMS notifications
- **Nodemailer** - Email notifications
- **Firebase Cloud Messaging** - Push notifications

## 📁 Project Structure

```
fixkart/
├── fixkart-frontend/          # React frontend
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   ├── sw.js              # Service worker
│   │   └── firebase-messaging-sw.js
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/            # Button, Input, Card, etc.
│   │   │   ├── layout/        # Header, Footer, Layouts
│   │   │   ├── modals/        # Modal components
│   │   │   └── ai/            # AI Assistant
│   │   ├── pages/             # Route pages
│   │   │   ├── auth/          # Login, Signup, etc.
│   │   │   ├── services/      # Services catalog
│   │   │   ├── booking/       # Booking flow
│   │   │   ├── payment/       # Payment pages
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── worker/        # Worker portal
│   │   │   ├── admin/         # Admin panel
│   │   │   └── static/        # About, FAQ, etc.
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Zustand stores
│   │   ├── utils/             # Utility functions
│   │   └── config/            # Firebase config
│   ├── package.json
│   └── vite.config.js
│
└── fixkart-backend/           # Firebase backend
    ├── functions/
    │   ├── routes/            # API routes
    │   │   ├── auth.js
    │   │   ├── users.js
    │   │   ├── workers.js
    │   │   ├── services.js
    │   │   ├── bookings.js
    │   │   ├── payments.js
    │   │   ├── reviews.js
    │   │   ├── notifications.js
    │   │   ├── ai.js
    │   │   └── admin.js
    │   ├── middleware/        # Express middleware
    │   ├── services/          # Business services
    │   ├── utils/             # Helpers
    │   └── scripts/           # Seed data scripts
    ├── firestore.rules        # Security rules
    ├── storage.rules          # Storage rules
    └── firebase.json          # Firebase config
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase CLI
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/fixkart.git
cd fixkart
```

### 2. Frontend Setup
```bash
cd fixkart-frontend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Firebase config
# Start development server
npm run dev
```

### 3. Backend Setup
```bash
cd fixkart-backend/functions
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys
# Start Firebase emulators
firebase emulators:start
```

### 4. Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email, Google, Phone)
3. Create Firestore database
4. Enable Storage
5. Copy Firebase config to frontend .env
6. Deploy rules:
```bash
firebase deploy --only firestore:rules,storage:rules
```

### 5. Deploy
```bash
# Deploy backend
cd fixkart-backend
firebase deploy --only functions

# Build & deploy frontend
cd ../fixkart-frontend
npm run build
firebase deploy --only hosting
```

## 🔑 Environment Variables

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
VITE_RAZORPAY_KEY_ID=rzp_xxx
VITE_GOOGLE_MAPS_API_KEY=xxx
```

### Backend (.env)
```
OPENAI_API_KEY=sk-xxx
GOOGLE_VISION_API_KEY=xxx
RAZORPAY_KEY_ID=rzp_xxx
RAZORPAY_KEY_SECRET=xxx
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
SMTP_HOST=smtp.gmail.com
SMTP_USER=xxx@gmail.com
SMTP_PASS=xxx
```

## 📱 Features

### Customer Features
- 🏠 Browse 50+ home services
- 🤖 AI-powered service recommendations
- 📸 Photo-based issue detection
- 🗓️ Easy booking with slot selection
- 📍 Real-time worker tracking
- 💳 Razorpay payments
- 💰 Wallet system with cashback
- 📱 PWA with offline support
- 🔔 Push notifications

### Worker Features
- 📋 Job management dashboard
- 🗺️ Navigation to customer
- 💵 Earnings tracking
- ⭐ Rating system
- 🔔 Real-time job alerts

### Admin Features
- 📊 Analytics dashboard
- 👥 User management
- 👨‍🔧 Worker management
- 📦 Service catalog
- 💰 Payment reports
- 🗺️ Live worker map

## 📄 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/services | List services |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/:id | Get booking |
| POST | /api/payments/create-order | Create Razorpay order |
| POST | /api/ai/chat | AI chat |
| POST | /api/ai/analyze-image | Image analysis |

## 📝 License

MIT License - Free for personal and commercial use.

## 🤝 Contributing

Pull requests welcome! Please read the contributing guidelines first.

## 📞 Support

- Email: support@fixkart.in
- Phone: 1800-123-4567
- Chat: In-app AI assistant
>>>>>>> 3ef1c884eb81bcb36571653e4e009423591eaf4b
